const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-store')
  .then(async () => {
    // Check if admin exists
    let admin = await User.findOne({ email: 'admin@ecommerce.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@ecommerce.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin already exists.');
    }
    process.exit(0);
  });
