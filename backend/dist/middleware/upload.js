"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.uploadPath = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
exports.uploadPath = process.env.UPLOAD_DIR
    ? path_1.default.resolve(process.env.UPLOAD_DIR)
    : path_1.default.resolve(process.cwd(), "src", "uploads");
if (!fs_1.default.existsSync(exports.uploadPath)) {
    fs_1.default.mkdirSync(exports.uploadPath, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, exports.uploadPath);
    },
    filename: (_req, file, cb) => {
        const uniqueName = Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path_1.default.extname(file.originalname);
        cb(null, uniqueName);
    },
});
const fileFilter = (_req, file, cb) => {
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
    }
    else {
        cb(new Error("UNSUPPORTED_FILE_TYPE"));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024,
    },
});
//# sourceMappingURL=upload.js.map