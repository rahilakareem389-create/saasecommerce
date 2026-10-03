const fs = require('fs');
let store = fs.readFileSync('frontend/src/components/StoreLayout.jsx', 'utf8');

const targetStr = `<Link to="/cart" className="relative hover:text-primary-600 transition-colors flex items-center gap-1">`;
const newStr = `<NotificationsDropdown />\n                <Link to="/cart" className="relative hover:text-primary-600 transition-colors flex items-center gap-1">`;

store = store.replace(targetStr, newStr);

fs.writeFileSync('frontend/src/components/StoreLayout.jsx', store);
console.log("Updated StoreLayout");
