const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');

const checkCoupons = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-store');
    
    const allCoupons = await Coupon.find({});
    console.log("ALL COUPONS:");
    console.log(allCoupons);

    const activeCoupons = await Coupon.find({ isActive: true, expiryDate: { $gte: new Date() } });
    console.log("\nACTIVE COUPONS (fetched by dashboard):");
    console.log(activeCoupons);

    process.exit(0);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
}

checkCoupons();
