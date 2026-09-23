const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountAmount: { type: Number, required: true },
  maxDiscountAmount: { type: Number, default: null }, // Optional max limit for percentage discounts
  minOrderAmount: { type: Number, default: 0 },
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number, default: null }, // Null means unlimited
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
