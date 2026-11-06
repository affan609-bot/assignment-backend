import multer from 'multer';
import path from 'node:path';
import ApiError from '../utils/ApiError.js';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIMES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  // Never trust client MIME alone: check both mimetype and extension.
  if (ALLOWED_MIMES.includes(file.mimetype) && ALLOWED_EXTS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only JPG, JPEG, PNG and WEBP images are allowed.'));
  }
};

export const imageUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE, files: 5 },
});

export const singleImage = imageUpload.single('image');
export const multipleImages = imageUpload.array('images', 5);
export const singleFileField = (field) => imageUpload.single(field);
