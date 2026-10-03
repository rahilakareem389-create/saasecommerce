const mongoose = require('mongoose');

async function test() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-store');
  const db = mongoose.connection.db;
  const products = await db.collection('products').find({}).toArray();
  const weirdIds = products.filter(p => typeof p._id === 'string' || !mongoose.Types.ObjectId.isValid(p._id));
  console.log("Weird IDs:", weirdIds.map(p => p._id));
  process.exit();
}
test();
