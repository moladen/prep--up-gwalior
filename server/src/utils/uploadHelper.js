import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "../config/prisma.js";
import { AppError } from "../utils/asyncHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOADS_DIR = path.join(__dirname, "../../uploads");

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

function publicBaseUrl() {
  return (
    process.env.API_PUBLIC_URL ||
    process.env.BACKEND_URL ||
    `http://localhost:${process.env.PORT || 5000}`
  ).replace(/\/$/, "");
}

function extFromFile(file) {
  const name = file.originalname || "";
  const fromName = path.extname(name).toLowerCase();
  if (fromName) return fromName;
  if (file.mimetype === "image/png") return ".png";
  if (file.mimetype === "image/webp") return ".webp";
  if (file.mimetype === "application/pdf") return ".pdf";
  return ".jpg";
}

/** Upload file to local `server/uploads`. */
export async function uploadFile(file, folder = "prep-up-gwalior") {
  if (!file?.buffer) {
    throw new AppError("No file uploaded.", 400);
  }

  ensureUploadsDir();
  const safeFolder = String(folder).replace(/[^a-zA-Z0-9/_-]/g, "");
  const folderDir = path.join(UPLOADS_DIR, ...safeFolder.split("/").filter(Boolean));
  if (!fs.existsSync(folderDir)) {
    fs.mkdirSync(folderDir, { recursive: true });
  }

  const ext = extFromFile(file);
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const diskPath = path.join(folderDir, filename);
  await fs.promises.writeFile(diskPath, file.buffer);

  const relative = `${safeFolder}/${filename}`.replace(/\\/g, "/");
  return {
    secure_url: `${publicBaseUrl()}/uploads/${relative}`,
    public_id: `local:${relative}`,
    folder: safeFolder,
    format: ext.replace(".", ""),
    bytes: file.buffer?.length || 0,
  };
}

export async function deleteUploadedFile(publicId) {
  if (!publicId || !String(publicId).startsWith("local:")) return;

  const relative = String(publicId).slice("local:".length);
  const diskPath = path.join(UPLOADS_DIR, relative);
  try {
    await fs.promises.unlink(diskPath);
  } catch {
    // ignore missing files
  }
}

export async function saveMediaRecord(result, filename = "") {
  return prisma.media.create({
    data: {
      url: result.secure_url,
      publicId: result.public_id,
      filename,
      folder: result.folder || "prep-up-gwalior",
      format: result.format || "",
      bytes: result.bytes || 0,
    },
  });
}
