const fs = require('fs');
let data = fs.readFileSync('backend/models/User.js', 'utf8');

if (!data.includes('notifications:')) {
  data = data.replace(
    'role: { type: String, default: \'customer\' },',
    'role: { type: String, default: \'customer\' },\n  notifications: [{ message: String, isRead: { type: Boolean, default: false }, link: String, date: { type: Date, default: Date.now } }],'
  );
  fs.writeFileSync('backend/models/User.js', data);
  console.log("Updated User Schema");
} else {
  console.log("Already has notifications");
}
