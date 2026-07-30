import "./loadEnv";
import express from "express";
import cors from "cors";
import { MulterError } from "multer";
import activitiesRoute from "./routes/activities";
import teamRoutes from "./routes/team";
import projectsRoute from "./routes/projects";
import hubsRoutes from "./routes/hubs";
import provinceRoutes from "./routes/provinces";
import seedRoutes from "./routes/seed";
import mediaRoutes from "./routes/media";
import reportsRoutes from "./routes/reports";
import newslettersRoutes from "./routes/newsletters";
import homepageRoutes from "./routes/homepage";
import radioSpotRoutes from "./routes/radioSpots";
import publicationRoutes from "./routes/publications";
import pressStatementRoutes from "./routes/pressStatements";
import hubPhotoRoutes from "./routes/hubPhotos";
import authRoutes from "./routes/auth";
import settingsRoutes from "./routes/settings";
import usersRoutes from "./routes/users";
import partnersRoutes from "./routes/partners";
import donorsRoutes from "./routes/donors";
import resourcesRoutes from "./routes/resources";
import brochuresRoutes from "./routes/brochures";
import testimonialsRoutes from "./routes/testimonials";
import subscribersRoutes from "./routes/subscribers";
import contactRoutes from "./routes/contact";
import programsContentRoutes from "./routes/programs";
import { requireAuthForMutations } from "./middleware/auth";
import { uploadPath } from "./middleware/upload";
import hubEventRoutes from "./routes/hubEvents";


const app = express();

// Most hosts (Render, Railway, Fly.io, etc.) put the app behind a single
// reverse proxy, which sets X-Forwarded-For. Trusting exactly one hop lets
// express-rate-limit and req.ip see the real client IP instead of the
// proxy's, without blindly trusting an arbitrary forwarded chain.
app.set("trust proxy", 1);

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
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
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);

// Public-writable routes MUST be registered before the mutation-auth gate,
// so anonymous website visitors can submit the contact form, subscribe to the
// newsletter, and leave testimonials. (Admin-only actions on these are guarded
// individually below where needed.)
app.use("/api/contact", contactRoutes);
app.use("/api/subscribers", subscribersRoutes);
app.use("/api/testimonials", testimonialsRoutes);

app.use("/api", requireAuthForMutations);
app.use("/api/team", teamRoutes);
app.use("/api/activities", activitiesRoute);
app.use("/api/projects", projectsRoute);
app.use("/api/reports", reportsRoutes);
app.use("/api/hubs", hubsRoutes);
app.use("/api/provinces", provinceRoutes);
app.use("/api/seed", seedRoutes);
app.use("/uploads", express.static(uploadPath));
app.use("/api/media", mediaRoutes);
app.use("/api/newsletters", newslettersRoutes);
app.use("/api/homepage", homepageRoutes);
app.use("/api/radio-spots", radioSpotRoutes);
app.use("/api/publications", publicationRoutes);
app.use("/api/press-statements", pressStatementRoutes);
app.use("/api/hub-photos", hubPhotoRoutes);
app.use("/api/hub-events", hubEventRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/partners", partnersRoutes);
app.use("/api/donors", donorsRoutes);
app.use("/api/resources", resourcesRoutes);
app.use("/api/brochures", brochuresRoutes);
app.use("/api/program-content", programsContentRoutes);

app.get("/", (req, res) => {
  res.send("FPI Zambia API Running");

});

// Global error handler -- must be registered after all routes.
// Express recognizes this as an error handler because it takes 4 arguments.
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: express.NextFunction
  ) => {
    if (err instanceof MulterError) {
      const messages: Record<string, string> = {
        LIMIT_FILE_SIZE: "File is too large. Maximum upload size is 20MB.",
        LIMIT_UNEXPECTED_FILE: "Unexpected file field.",
      };

      return res.status(400).json({
        message: messages[err.code] || "Upload failed.",
      });
    }

    if (err?.message === "UNSUPPORTED_FILE_TYPE") {
      return res.status(400).json({
        message:
          "Unsupported file type. Allowed types: JPG, PNG, WEBP, GIF, PDF, DOC, DOCX, MP3, MP4.",
      });
    }

    console.error(err);

    res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  }
);

const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
