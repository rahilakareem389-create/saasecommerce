const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number }, // Optional discount price
  imageUrl: { type: String, required: true },
  images: [String], // Additional images
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String }, // Optional SKU code
  variants: [{
    size: String,
    color: String,
    stock: Number,
  }],
  status: { type: String, enum: ['Active', 'Draft', 'Out of Stock'], default: 'Active' },
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
