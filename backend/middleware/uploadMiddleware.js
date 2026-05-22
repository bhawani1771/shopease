// Multer config: saves uploaded images to /uploads with a unique filename.

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

function fileFilter(_req, file, cb) {
  const ok = /jpeg|jpg|png|webp|gif/.test(file.mimetype);
  cb(ok ? null : new Error("Only image files are allowed"), ok);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

module.exports = upload;
