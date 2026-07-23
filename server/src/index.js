import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import prisma from "./config/prisma.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { UPLOADS_DIR } from "./utils/uploadHelper.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import contactInfoRoutes from "./routes/contactInfoRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import platformRoutes from "./routes/platformRoutes.js";
import siteRoutes from "./routes/siteRoutes.js";
import studentAuthRoutes from "./routes/studentAuthRoutes.js";
import adminStudentRoutes from "./routes/adminStudentRoutes.js";
import portalAdminRoutes from "./routes/portalAdminRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

let server;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected via Prisma");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }

  app.set("trust proxy", 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(
    cors({
      origin: FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "10mb" }));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 400,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  // Local uploaded images/files
  app.use("/uploads", express.static(UPLOADS_DIR));

  app.get("/api/health", async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({
        status: "ok",
        service: "prep-up-gwalior-api",
        database: "postgresql",
      });
    } catch {
      res.status(503).json({ status: "error", database: "disconnected" });
    }
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/admin/dashboard", adminRoutes);
  app.use("/api/admin/students", adminStudentRoutes);
  app.use("/api/admin", portalAdminRoutes);
  app.use("/api/student", studentAuthRoutes);
  app.use("/api/auth/student", studentAuthRoutes);
  app.use("/api/courses", courseRoutes);
  app.use("/api/enquiries", enquiryRoutes);
  app.use("/api/results", resultRoutes);
  app.use("/api/testimonials", testimonialRoutes);
  app.use("/api/content", contentRoutes);
  app.use("/api/contact-info", contactInfoRoutes);
  app.use("/api/media", mediaRoutes);
  app.use("/api/platform", platformRoutes);
  app.use("/api/site", siteRoutes);

  app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
  });

  app.use(errorHandler);

  server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use. Stop other server instances.`);
      process.exit(1);
    }
    throw err;
  });
}

async function shutdown() {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();
