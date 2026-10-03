const fs = require('fs');
let data = fs.readFileSync('backend/server.js', 'utf8');

const regexQuestions = /app\.post\('\/api\/products\/:id\/questions', async \(req, res\) => \{[\s\S]*?\}\);/;
const regexAnswer = /app\.post\('\/api\/products\/:id\/questions\/:questionId\/answer', async \(req, res\) => \{[\s\S]*?\}\);/;

const newQuestions = `app.post('/api/products/:id/questions', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.questions.push({
      user: req.body.user || 'Anonymous',
      userId: req.body.userId || null,
      question: req.body.question
    });
    await product.save();

    // Notify all admins
    const User = require('./models/User');
    await User.updateMany({ role: 'admin' }, {
      $push: { notifications: { message: \`New question on \${product.title}\`, link: '/admin' } }
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});`;

const newAnswer = `app.post('/api/products/:id/questions/:questionId/answer', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const question = product.questions.id(req.params.questionId);
    if (question) {
      question.answer = req.body.answer;
      await product.save();

      // Notify the user who asked
      if (question.userId) {
        const User = require('./models/User');
        await User.findByIdAndUpdate(question.userId, {
          $push: { notifications: { message: \`Admin answered your question on \${product.title}\`, link: \`/product/\${product._id}\` } }
        });
      }

      res.json(product);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});`;

data = data.replace(regexQuestions, newQuestions);
data = data.replace(regexAnswer, newAnswer);

const notifEndpoints = `
// Notifications Endpoints
app.get('/api/notifications', verifyToken, async (req, res) => {
  try {
    const User = require('./models/User');
    const user = await User.findById(req.user.id);
    if(!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.notifications.sort((a,b) => b.date - a.date));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/notifications/:id/read', verifyToken, async (req, res) => {
  try {
    const User = require('./models/User');
    const user = await User.findById(req.user.id);
    const notif = user.notifications.id(req.params.id);
    if(notif) { notif.isRead = true; await user.save(); }
    res.json(user.notifications.sort((a,b) => b.date - a.date));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/notifications/read-all', verifyToken, async (req, res) => {
  try {
    const User = require('./models/User');
    const user = await User.findById(req.user.id);
    user.notifications.forEach(n => n.isRead = true);
    await user.save();
    res.json(user.notifications.sort((a,b) => b.date - a.date));
  } catch (err) { res.status(500).json({ message: err.message }); }
});
`;

data = data.replace('// --- API ROUTES ---', '// --- API ROUTES ---\n' + notifEndpoints);

fs.writeFileSync('backend/server.js', data);
console.log("Updated server.js");
