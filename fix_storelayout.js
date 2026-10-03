const fs = require('fs');
let data = fs.readFileSync('frontend/src/components/StoreLayout.jsx', 'utf8');

data = data.replace(
  "import { Outlet, Link, useNavigate } from 'react-router-dom';",
  "import { Outlet, Link, useNavigate } from 'react-router-dom';\nimport NotificationsDropdown from './NotificationsDropdown';"
);

fs.writeFileSync('frontend/src/components/StoreLayout.jsx', data);
console.log("Success");
