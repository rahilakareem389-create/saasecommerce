const fs = require('fs');
let data = fs.readFileSync('backend/server.js', 'utf8');

const newEndpoints = `
// Product Q&A endpoints
app.post('/api/products/:id/questions', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.questions.push({
      user: req.body.user || 'Anonymous',
      question: req.body.question
    });
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/products/:id/questions/:questionId/answer', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const question = product.questions.id(req.params.questionId);
    if (question) {
      question.answer = req.body.answer;
      await product.save();
      res.json(product);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/products/:id/reviews'
`;

data = data.replace("app.post('/api/products/:id/reviews'", newEndpoints);
fs.writeFileSync('backend/server.js', data);
console.log("Success");
