const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');

const updateCoupon = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-store');
    
    await Coupon.updateOne({ code: '2EW3R' }, { $set: { expiryDate: new Date('2026-12-22T00:00:00.000Z') } });
    console.log("Coupon updated to year 2026!");

    process.exit(0);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
}

updateCoupon();
