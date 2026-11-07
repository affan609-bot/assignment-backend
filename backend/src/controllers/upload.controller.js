import { Readable } from 'node:stream';
import cloudinary, { isConfigured } from '../config/cloudinary.js';
import Upload from '../models/Upload.js';
import ApiError from '../utils/ApiError.js';
import { saveLocal, deleteLocal } from '../utils/file.js';

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'products-admin', resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    Readable.from(buffer).pipe(stream);
  });

const storeImage = async (file) => {
  if (isConfigured()) {
    const result = await uploadToCloudinary(file.buffer);
    return {
      url: result.secure_url,
      publicId: result.public_id,
      storage: 'cloudinary',
    };
  }
  // Fallback: local disk
  const local = saveLocal(file.buffer, file.originalname);
  return { url: local.url, publicId: local.filename, storage: 'local' };
};

const destroyImage = async (doc) => {
  if (doc.storage === 'cloudinary' && isConfigured()) {
    try { await cloudinary.uploader.destroy(doc.publicId); } catch (e) { console.error(e.message); }
  } else {
    deleteLocal(doc.publicId);
  }
};

export const uploadSingle = async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No image uploaded.');
  const stored = await storeImage(req.file);
  const doc = await Upload.create({
    originalName: req.file.originalname,
    url: stored.url,
    publicId: stored.publicId,
    storage: stored.storage,
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
    const stored = await storeImage(f);
    docs.push(
      await Upload.create({
        originalName: f.originalname,
        url: stored.url,
        publicId: stored.publicId,
        storage: stored.storage,
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
  await destroyImage(doc);
  res.json({ success: true, message: 'Upload deleted.' });
};
