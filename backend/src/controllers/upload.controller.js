import Upload from '../models/Upload.js';
import { deleteFile } from '../utils/file.js';
import ApiError from '../utils/ApiError.js';

export const uploadSingle = async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No image uploaded.');
  const doc = await Upload.create({
    filename: req.file.filename,
    originalName: req.file.originalname,
    path: `/uploads/${req.file.filename}`,
    mimetype: req.file.mimetype,
    size: req.file.size,
    uploadedBy: req.admin?._id,
  });
  res.status(201).json({ success: true, data: doc });
};

export const uploadMultiple = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw ApiError.badRequest('No images uploaded.');
  }
  const docs = await Upload.insertMany(
    req.files.map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      path: `/uploads/${f.filename}`,
      mimetype: f.mimetype,
      size: f.size,
      uploadedBy: req.admin?._id,
    }))
  );
  res.status(201).json({ success: true, count: docs.length, data: docs });
};

export const listUploads = async (req, res) => {
  const items = await Upload.find().sort({ createdAt: -1 });
  res.json({ success: true, total: items.length, data: items });
};

export const deleteUpload = async (req, res) => {
  const doc = await Upload.findByIdAndDelete(req.params.id);
  if (!doc) throw ApiError.notFound('Upload not found.');
  deleteFile(doc.filename);
  res.json({ success: true, message: 'Upload deleted.' });
};
