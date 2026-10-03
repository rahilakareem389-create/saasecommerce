const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');

const seedCoupon = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-store');
    console.log('Connected');
    
    await Coupon.deleteMany({});
    
    await Coupon.create({
      code: 'WELCOME20',
      discountType: 'percentage',
      discountAmount: 20,
      minOrderAmount: 50,
      expiryDate: new Date('2027-12-31'),
      isActive: true
    });
    
    await Coupon.create({
      code: 'FLAT50',
      discountType: 'fixed',
      discountAmount: 50,
      minOrderAmount: 200,
      expiryDate: new Date('2027-12-31'),
      isActive: true
    });

    console.log('Coupons seeded.');
    process.exit(0);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
}

seedCoupon();
