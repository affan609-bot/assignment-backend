import { Readable } from 'node:stream';
import cloudinary, { isConfigured } from '../config/cloudinary.js';
import Upload from '../models/Upload.js';
import ApiError from '../utils/ApiError.js';

const uploadBuffer = (buffer, folder = 'products-admin') =>
  new Promise((resolve, reject) => {
    if (!isConfigured()) {
      return reject(new ApiError(500, 'Cloudinary is not configured. Set CLOUDINARY_* in .env'));
    }
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    Readable.from(buffer).pipe(stream);
  });

export const uploadSingle = async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No image uploaded.');
  const result = await uploadBuffer(req.file.buffer);
  const doc = await Upload.create({
    originalName: req.file.originalname,
    url: result.secure_url,
    publicId: result.public_id,
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
  const docs = [];
  for (const f of req.files) {
    const result = await uploadBuffer(f.buffer);
    docs.push(
      await Upload.create({
        originalName: f.originalname,
        url: result.secure_url,
        publicId: result.public_id,
        mimetype: f.mimetype,
        size: f.size,
        uploadedBy: req.admin?._id,
      })
    );
  }
  res.status(201).json({ success: true, count: docs.length, data: docs });
};

export const listUploads = async (req, res) => {
  const items = await Upload.find().sort({ createdAt: -1 });
  res.json({ success: true, total: items.length, data: items });
};

export const deleteUpload = async (req, res) => {
  const doc = await Upload.findByIdAndDelete(req.params.id);
  if (!doc) throw ApiError.notFound('Upload not found.');
  try {
    await cloudinary.uploader.destroy(doc.publicId);
  } catch (e) {
    console.error('Cloudinary destroy failed:', e.message);
  }
  res.json({ success: true, message: 'Upload deleted.' });
};
