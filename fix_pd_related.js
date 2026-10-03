const fs = require('fs');
let data = fs.readFileSync('frontend/src/pages/ProductDetails.jsx', 'utf8');

data = data.replace(
  'setRelatedProducts(data.products.filter(p => p._id !== id).slice(0, 4));',
  'setRelatedProducts((Array.isArray(data) ? data : (data.products || [])).filter(p => p._id !== id).slice(0, 4));'
);

fs.writeFileSync('frontend/src/pages/ProductDetails.jsx', data);
console.log("Fixed fetchRelatedProducts error");
