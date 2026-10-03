const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function fixUser() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-store');
  const db = mongoose.connection.db;
  const users = await db.collection('users').find({}).toArray();
  console.log("Users:", users.map(u => ({ email: u.email, role: u.role })));
  
  // Set password to 'password123' for wordpressrahila
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('password123', salt);
  await db.collection('users').updateOne({ email: 'wordpressrahila@gmail.com' }, { $set: { password: hash } });
  console.log("Password reset to 'password123' for wordpressrahila@gmail.com");

  process.exit();
}
fixUser();
