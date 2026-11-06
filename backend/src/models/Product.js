import mongoose from 'mongoose';

/**
 * Product schema.
 * timestamps: true automatically adds createdAt and updatedAt.
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required.'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters.'],
      maxlength: [100, 'Name cannot exceed 100 characters.'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters.'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required.'],
      min: [0, 'Price cannot be negative.'],
    },
    category: {
      type: String,
      required: [true, 'Category is required.'],
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative.'],
    },
    // Multiple images support (Multer phase). Each entry: { url, filename }
    images: [
      {
        url: { type: String, required: true },
        filename: { type: String, required: true },
      },
    ],
    // Who created it (admin). Filled in auth phase.
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

// Text index for search by name/description.
productSchema.index({ name: 'text', description: 'text' });
// Index for category filter + sort.
productSchema.index({ category: 1, createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
