import { Router } from "express";
import { Readable } from "stream";
import path from "path";
import type { UploadApiOptions, UploadApiResponse } from "cloudinary";
import { prisma } from "../lib/prisma";
import { upload } from "../middleware/upload";
import { cloudinary } from "../lib/cloudinary";

const router = Router();

// Images use Cloudinary's "image" pipeline; audio and (unused today) video
// use "video", which is Cloudinary's category for all non-image media;
// everything else (PDF, Word docs) is uploaded as "raw".
function resourceTypeFor(mimeType: string): "image" | "video" | "raw" {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/") || mimeType.startsWith("video/")) return "video";
  return "raw";
}

function uploadBufferToCloudinary(
  buffer: Buffer,
  options: UploadApiOptions
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) {
        return reject(error || new Error("Cloudinary upload failed"));
      }

      resolve(result);
    });

    Readable.from(buffer).pipe(uploadStream);
  });
}

/**
 * GET ALL MEDIA
 */
router.get("/", async (_req, res) => {
  try {
    const media = await prisma.media.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(media);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch media",
    });
  }
});

const EXTENSION_BY_MIME: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function sanitizeDownloadName(name: string) {
  const safe = name.replace(/[^a-zA-Z0-9-_ ]+/g, "").trim().replace(/\s+/g, "_");
  return safe || "download";
}

/**
 * PROXY / DOWNLOAD FILE
 *
 * Cloudinary's "raw" delivery (used for PDFs/docs) always sends
 * Content-Disposition: attachment and ignores on-the-fly transformations,
 * so a raw file can never be shown inline (e.g. in a preview <iframe>) and
 * its filename can't be customized by manipulating the Cloudinary URL.
 * Streaming the file through our own server lets us set both explicitly.
 */
router.get("/proxy", async (req, res) => {
  try {
    const sourceUrl = typeof req.query.url === "string" ? req.query.url : "";
    const mode = req.query.mode === "inline" ? "inline" : "attachment";

    let parsed: URL;
    try {
      parsed = new URL(sourceUrl);
    } catch {
      return res.status(400).json({ message: "Invalid file url" });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    // Only ever proxy our own Cloudinary assets -- never an arbitrary
    // attacker-supplied URL (this endpoint has no auth requirement).
    if (
      parsed.protocol !== "https:" ||
      parsed.hostname !== "res.cloudinary.com" ||
      !cloudName ||
      !parsed.pathname.startsWith(`/${cloudName}/`)
    ) {
      return res.status(400).json({ message: "File url not allowed" });
    }

    const upstream = await fetch(parsed.toString());

    if (!upstream.ok || !upstream.body) {
      return res.status(502).json({ message: "Failed to fetch file" });
    }

    const upstreamType = (upstream.headers.get("content-type") || "").split(";")[0].trim();
    const ext =
      EXTENSION_BY_MIME[upstreamType] ||
      path.extname(parsed.pathname).replace(".", "").toLowerCase() ||
      // This app's raw uploads are overwhelmingly PDFs, and legacy assets
      // uploaded before extensions were embedded in the public_id come
      // back from Cloudinary as generic octet-stream with no clue to their
      // real type -- defaulting to pdf is the best guess available.
      "pdf";

    // Same reasoning: force a renderable Content-Type for inline preview
    // when Cloudinary couldn't tell us one, so the browser's PDF viewer
    // actually opens the iframe content instead of trying to download it.
    const contentType =
      upstreamType && upstreamType !== "application/octet-stream"
        ? upstreamType
        : mode === "inline"
        ? "application/pdf"
        : upstreamType || "application/octet-stream";

    const requestedName =
      typeof req.query.filename === "string" && req.query.filename
        ? sanitizeDownloadName(req.query.filename)
        : "download";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `${mode}; filename="${requestedName}.${ext}"`);

    const contentLength = upstream.headers.get("content-length");
    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }

    Readable.fromWeb(upstream.body as any).pipe(res);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to proxy file",
    });
  }
});

/**
 * GET SINGLE MEDIA
 */
router.get("/:id", async (req, res) => {
  try {
    const media = await prisma.media.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!media) {
      return res.status(404).json({
        message: "Media not found",
      });
    }

    res.json(media);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch media",
    });
  }
});

/**
 * UPLOAD MEDIA
 */
router.post(
  "/",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      const resourceType = resourceTypeFor(req.file.mimetype);

      const uploadOptions: UploadApiOptions = {
        folder: "fpi-zambia",
        resource_type: resourceType,
      };

      // Note: raw public_ids are deliberately left without a file extension.
      // Cloudinary blocks unauthenticated delivery of raw resources whose
      // URL ends in .pdf/.zip/etc (401 "deny or ACL failure") as a security
      // measure, so embedding the extension here would make every raw
      // upload undownloadable. The /media/proxy route below reconstructs
      // the correct Content-Type/filename on the way out instead.

      const result = await uploadBufferToCloudinary(req.file.buffer, uploadOptions);

      const media = await prisma.media.create({
        data: {
          filename: result.public_id,
          originalName:
            req.body.originalName ||
            req.file.originalname,

          url: result.secure_url,

          mimeType: req.file.mimetype,

          size: req.file.size,

          alt: req.body.alt || "",

          description:
            req.body.description || "",
        },
      });

      res.status(201).json(media);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Failed to upload media",
      });

    }
  }
);
/**
 * UPDATE MEDIA
 */
router.put("/:id", async (req, res) => {
  try {
    const media = await prisma.media.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        originalName: req.body.originalName,
        alt: req.body.alt,
        description: req.body.description,
      },
    });

    res.json(media);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to update media",
    });

  }
});

/**
 * DELETE MEDIA
 */
router.delete("/:id", async (req, res) => {
  try {
    await prisma.media.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json({
      message: "Media deleted successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to delete media",
    });

  }
});

export default router;
