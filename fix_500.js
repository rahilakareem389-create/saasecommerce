const fs = require('fs');
let data = fs.readFileSync('backend/server.js', 'utf8');

data = data.replace(
  "res.status(500).json({ message: 'Server Error' });",
  "if (err.name === 'CastError') return res.status(404).json({ message: 'Product not found' });\n      res.status(500).json({ message: err.message });"
);

fs.writeFileSync('backend/server.js', data);
console.log("Fixed CastError 500 issue");
