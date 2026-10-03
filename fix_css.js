const fs = require('fs');
let p = 'F:/internship/New folder (2)/ecommerce/frontend/src/index.css';
let d = fs.readFileSync(p, 'utf8');

// Find the index of the literal '\n\n.hide-scrollbar' and remove it
const badString = '\\n\\n.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }\\n.hide-scrollbar::-webkit-scrollbar { display: none; }\\n';

if (d.includes(badString)) {
  d = d.replace(badString, '\n\n.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }\n.hide-scrollbar::-webkit-scrollbar { display: none; }\n');
  fs.writeFileSync(p, d);
  console.log("Fixed!");
} else {
  console.log("Not found.");
}
