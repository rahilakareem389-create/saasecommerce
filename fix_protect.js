const fs = require('fs');
let data = fs.readFileSync('backend/server.js', 'utf8');

data = data.replace(/verifyToken/g, 'protect');
data = data.replace(/req\.user\.id/g, 'req.user._id');

fs.writeFileSync('backend/server.js', data);
console.log("Replaced verifyToken with protect");
