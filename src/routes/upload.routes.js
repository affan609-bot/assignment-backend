import { Router } from 'express';
import { upload } from '../upload.js';

const router = Router();

// POST /api/uploads  (multipart/form-data, field name: image)
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Choose an image file to upload.' });
  }

  res.status(201).json({
    success: true,
    data: {
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      size: req.file.size,
    },
  });
});

export default router;
