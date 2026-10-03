const mongoose = require('mongoose');

async function test() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-store');
  const db = mongoose.connection.db;
  const products = await db.collection('products').find({}).toArray();
  console.log("ecommerce-store products count:", products.length);
  process.exit();
}
test();
