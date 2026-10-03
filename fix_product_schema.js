const fs = require('fs');
let data = fs.readFileSync('backend/models/Product.js', 'utf8');

data = data.replace(
  'questions: [{ user: String, question: String, answer: String, date: { type: Date, default: Date.now } }]',
  'questions: [{ user: String, userId: { type: mongoose.Schema.Types.ObjectId, ref: \'User\' }, question: String, answer: String, date: { type: Date, default: Date.now } }]'
);

fs.writeFileSync('backend/models/Product.js', data);
console.log("Updated Product Schema");
