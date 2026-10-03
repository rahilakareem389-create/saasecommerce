const fs = require('fs');
const p = 'F:/internship/New folder (2)/ecommerce/backend/server.js';
let d = fs.readFileSync(p, 'utf8');

d = d.replace(
  "product.reviews.push(review);\n        await product.save();\n        res.status(201).json({ message: 'Review added and pending approval' });",
  `product.reviews.push(review);
        await product.save();
        
        const User = require('./models/User');
        await User.updateMany({ role: 'admin' }, {
          $push: { notifications: { message: \`New review on \${product.title}\`, link: '/admin/reviews' } }
        });

        res.status(201).json({ message: 'Review added and pending approval' });`
);

fs.writeFileSync(p, d);
