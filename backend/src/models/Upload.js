import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true }, // Cloudinary public_id OR local filename
    storage: { type: String, enum: ['cloudinary', 'local'], default: 'cloudinary' },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

const Upload = mongoose.model('Upload', uploadSchema);
export default Upload;
