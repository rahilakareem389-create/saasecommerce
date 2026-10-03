const fs = require('fs');

// 1. AdminLayout
let admin = fs.readFileSync('frontend/src/components/AdminLayout.jsx', 'utf8');
if (!admin.includes('NotificationsDropdown')) {
  admin = admin.replace(
    "import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';",
    "import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';\nimport NotificationsDropdown from './NotificationsDropdown';"
  );
  
  // Replace the bell icon in admin layout
  const bellRegex = /<button className="p-2 text-slate-500.*?<Bell size={24} \/>\s*<\/button>/;
  if(bellRegex.test(admin)) {
    admin = admin.replace(bellRegex, "<NotificationsDropdown />");
  } else {
    // just put it before the dark mode toggle
    const toggleRegex = /<button\s*onClick=\{toggleTheme\}/;
    admin = admin.replace(toggleRegex, "<NotificationsDropdown />\n          <button onClick={toggleTheme}");
  }
  fs.writeFileSync('frontend/src/components/AdminLayout.jsx', admin);
  console.log("Updated AdminLayout");
}

// 2. StoreLayout
let store = fs.readFileSync('frontend/src/components/StoreLayout.jsx', 'utf8');
if (!store.includes('NotificationsDropdown')) {
  store = store.replace(
    "import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';",
    "import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';\nimport NotificationsDropdown from './NotificationsDropdown';"
  );
  
  // Find where to put it in header. There is usually a user icon or cart icon
  const cartRegex = /<Link to="\/cart" className="relative p-2.*?<\/Link>/;
  if(cartRegex.test(store)) {
    store = store.replace(cartRegex, "<NotificationsDropdown />\n                " + store.match(cartRegex)[0]);
    fs.writeFileSync('frontend/src/components/StoreLayout.jsx', store);
    console.log("Updated StoreLayout");
  } else {
    console.log("Could not find place in StoreLayout");
  }
}
