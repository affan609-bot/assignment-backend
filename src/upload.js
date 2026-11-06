import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
export const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB) || 5;

mkdirSync(UPLOAD_DIR, { recursive: true });

// Map accepted MIME types to a safe extension. The client filename is never used.
const IMAGE_TYPES = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
  ['image/avif', '.avif'],
]);

const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, UPLOAD_DIR),
  filename: (req, file, callback) => {
    const extension = IMAGE_TYPES.get(file.mimetype) || '.jpg';
    const name = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${extension}`;
    callback(null, name);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!IMAGE_TYPES.has(file.mimetype)) {
      const error = new Error('Only JPG, PNG, WebP, GIF or AVIF images are allowed.');
      error.status = 400;
      return callback(error);
    }
    callback(null, true);
  },
});
