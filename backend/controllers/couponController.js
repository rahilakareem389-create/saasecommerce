const Coupon = require('../models/Coupon');

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountAmount, maxDiscountAmount, minOrderAmount, expiryDate, usageLimit, isActive } = req.body;
    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (couponExists) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code, discountType, discountAmount, maxDiscountAmount, minOrderAmount, expiryDate, usageLimit, isActive
    });
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Public
const validateCoupon = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon' });
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    if (orderTotal < coupon.minOrderAmount) {
      return res.status(400).json({ message: `Minimum order amount of $${coupon.minOrderAmount} required` });
    }

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (coupon) {
      res.json(coupon);
    } else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (coupon) {
      res.json({ message: 'Coupon removed' });
    } else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActiveCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true, expiryDate: { $gte: new Date() } }).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCoupon, getCoupons, validateCoupon, updateCoupon, deleteCoupon, getActiveCoupons };
