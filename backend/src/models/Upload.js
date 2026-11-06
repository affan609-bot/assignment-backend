import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    path: { type: String, required: true }, // URL path like /uploads/<filename>
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

const Upload = mongoose.model('Upload', uploadSchema);
export default Upload;
