const mongoose = require('mongoose');

const fixStock = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-store');
    console.log('Connected');

    const Product = require('./models/Product');
    const result = await Product.updateMany({}, { $set: { stock: 20 } });
    console.log('Updated ' + result.modifiedCount + ' products.');

    process.exit(0);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
}

fixStock();
