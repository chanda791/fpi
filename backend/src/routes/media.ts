import { Router } from "express";
import { Readable } from "stream";
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

      const result = await uploadBufferToCloudinary(req.file.buffer, {
        folder: "fpi-zambia",
        resource_type: resourceTypeFor(req.file.mimetype),
      });

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
