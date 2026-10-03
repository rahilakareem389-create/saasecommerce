const fs = require('fs');
let p = 'F:/internship/New folder (2)/ecommerce/frontend/src/components/AdminLayout.jsx';
let d = fs.readFileSync(p, 'utf8');

if (!d.includes('NotificationsDropdown')) {
  d = d.replace("import { Outlet, Link, useLocation } from 'react-router-dom';", "import { Outlet, Link, useLocation } from 'react-router-dom';\nimport NotificationsDropdown from './NotificationsDropdown';");
  
  d = d.replace(/<div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">\s*AD\s*<\/div>/, '<NotificationsDropdown />\n            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">\n              AD\n            </div>');
  
  fs.writeFileSync(p, d);
}
