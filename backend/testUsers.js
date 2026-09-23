const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-store')
  .then(async () => {
    const users = await User.find({});
    console.log("Users:", users.map(u => ({ id: u._id, email: u.email, role: u.role })));
    process.exit(0);
  });
