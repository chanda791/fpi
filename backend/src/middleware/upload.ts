import multer from "multer";
import path from "path";

// Legacy path: still resolved (and still served statically in server.ts) so
// files uploaded before the Cloudinary cutover keep working, but nothing
// writes new files here anymore -- uploads now go straight to Cloudinary
// via an in-memory buffer (see routes/media.ts).
export const uploadPath = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.resolve(process.cwd(), "src", "uploads");

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb
) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    // SVG is intentionally excluded: it's servable directly from /uploads
    // and can carry an embedded <script>, making it a stored-XSS vector.
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "audio/mpeg",
    "audio/mp3",
    "video/mp4",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("UNSUPPORTED_FILE_TYPE"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});
