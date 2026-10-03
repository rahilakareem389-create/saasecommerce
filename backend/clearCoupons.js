const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');

const clearCoupons = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-store');
    console.log('Connected');
    
    await Coupon.deleteMany({});
    
    console.log('Coupons cleared.');
    process.exit(0);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
}

clearCoupons();
