const fs = require('fs');
let data = fs.readFileSync('frontend/src/pages/ProductDetails.jsx', 'utf8');

data = data.replace(
  "user: user?.name || 'Guest User'",
  "user: user?.name || 'Guest User', userId: user?._id || null"
);

fs.writeFileSync('frontend/src/pages/ProductDetails.jsx', data);
console.log("Updated ProductDetails for userId");
