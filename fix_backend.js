const fs = require('fs');
let data = fs.readFileSync('backend/server.js', 'utf8');

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

if (!data.includes("app.get('/api/notifications'")) {
  data = data.replace('const PORT =', notifEndpoints + '\nconst PORT =');
  fs.writeFileSync('backend/server.js', data);
  console.log("Added notifications endpoints");
}
