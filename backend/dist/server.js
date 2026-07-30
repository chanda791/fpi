"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./loadEnv");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = require("multer");
const activities_1 = __importDefault(require("./routes/activities"));
const team_1 = __importDefault(require("./routes/team"));
const projects_1 = __importDefault(require("./routes/projects"));
const hubs_1 = __importDefault(require("./routes/hubs"));
const provinces_1 = __importDefault(require("./routes/provinces"));
const seed_1 = __importDefault(require("./routes/seed"));
const media_1 = __importDefault(require("./routes/media"));
const reports_1 = __importDefault(require("./routes/reports"));
const newsletters_1 = __importDefault(require("./routes/newsletters"));
const homepage_1 = __importDefault(require("./routes/homepage"));
const radioSpots_1 = __importDefault(require("./routes/radioSpots"));
const publications_1 = __importDefault(require("./routes/publications"));
const pressStatements_1 = __importDefault(require("./routes/pressStatements"));
const hubPhotos_1 = __importDefault(require("./routes/hubPhotos"));
const auth_1 = __importDefault(require("./routes/auth"));
const settings_1 = __importDefault(require("./routes/settings"));
const users_1 = __importDefault(require("./routes/users"));
const partners_1 = __importDefault(require("./routes/partners"));
const donors_1 = __importDefault(require("./routes/donors"));
const resources_1 = __importDefault(require("./routes/resources"));
const brochures_1 = __importDefault(require("./routes/brochures"));
const testimonials_1 = __importDefault(require("./routes/testimonials"));
const subscribers_1 = __importDefault(require("./routes/subscribers"));
const contact_1 = __importDefault(require("./routes/contact"));
const programs_1 = __importDefault(require("./routes/programs"));
const auth_2 = require("./middleware/auth");
const upload_1 = require("./middleware/upload");
const hubEvents_1 = __importDefault(require("./routes/hubEvents"));
const app = (0, express_1.default)();
// Most hosts (Render, Railway, Fly.io, etc.) put the app behind a single
// reverse proxy, which sets X-Forwarded-For. Trusting exactly one hop lets
// express-rate-limit and req.ip see the real client IP instead of the
// proxy's, without blindly trusting an arbitrary forwarded chain.
app.set("trust proxy", 1);
const allowedOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
app.use((0, cors_1.default)({
    // Requests with no Origin header (server-to-server, curl, mobile apps)
    // are always allowed. Browser cross-origin requests are only allowed
    // when their origin is explicitly listed in CORS_ORIGIN -- if that env
    // var is unset, browser cross-origin requests are rejected rather than
    // defaulting to "allow everything".
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
}));
app.use(express_1.default.json());
app.use("/api/auth", auth_1.default);
// Public-writable routes MUST be registered before the mutation-auth gate,
// so anonymous website visitors can submit the contact form, subscribe to the
// newsletter, and leave testimonials. (Admin-only actions on these are guarded
// individually below where needed.)
app.use("/api/contact", contact_1.default);
app.use("/api/subscribers", subscribers_1.default);
app.use("/api/testimonials", testimonials_1.default);
app.use("/api", auth_2.requireAuthForMutations);
app.use("/api/team", team_1.default);
app.use("/api/activities", activities_1.default);
app.use("/api/projects", projects_1.default);
app.use("/api/reports", reports_1.default);
app.use("/api/hubs", hubs_1.default);
app.use("/api/provinces", provinces_1.default);
app.use("/api/seed", seed_1.default);
app.use("/uploads", express_1.default.static(upload_1.uploadPath));
app.use("/api/media", media_1.default);
app.use("/api/newsletters", newsletters_1.default);
app.use("/api/homepage", homepage_1.default);
app.use("/api/radio-spots", radioSpots_1.default);
app.use("/api/publications", publications_1.default);
app.use("/api/press-statements", pressStatements_1.default);
app.use("/api/hub-photos", hubPhotos_1.default);
app.use("/api/hub-events", hubEvents_1.default);
app.use("/api/settings", settings_1.default);
app.use("/api/users", users_1.default);
app.use("/api/partners", partners_1.default);
app.use("/api/donors", donors_1.default);
app.use("/api/resources", resources_1.default);
app.use("/api/brochures", brochures_1.default);
app.use("/api/program-content", programs_1.default);
app.get("/", (req, res) => {
    res.send("FPI Zambia API Running");
});
// Global error handler -- must be registered after all routes.
// Express recognizes this as an error handler because it takes 4 arguments.
app.use((err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    if (err instanceof multer_1.MulterError) {
        const messages = {
            LIMIT_FILE_SIZE: "File is too large. Maximum upload size is 20MB.",
            LIMIT_UNEXPECTED_FILE: "Unexpected file field.",
        };
        return res.status(400).json({
            message: messages[err.code] || "Upload failed.",
        });
    }
    if (err?.message === "UNSUPPORTED_FILE_TYPE") {
        return res.status(400).json({
            message: "Unsupported file type. Allowed types: JPG, PNG, WEBP, GIF, PDF, DOC, DOCX, MP3, MP4.",
        });
    }
    console.error(err);
    res.status(500).json({
        message: "Something went wrong. Please try again.",
    });
});
const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map