import multer from 'multer';
import ApiError from '../utils/ApiError.js';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIMES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = (file.originalname.split('.').pop() || '').toLowerCase();
  const extWithDot = '.' + ext;
  if (ALLOWED_MIMES.includes(file.mimetype) && ALLOWED_EXTS.includes(extWithDot)) {
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
