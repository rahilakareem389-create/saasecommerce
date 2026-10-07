const fs = require('fs');

const path = 'frontend/src/pages/StoreFront.jsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /const defaultCategories = \[[\s\S]*?const generateDummyProducts = \(\) => \{[\s\S]*?return prods;\n  \};/g;

const matches = content.match(regex);
if (matches) {
  content = content.replace(regex, '');
  content = content.replace('useEffect(() => {', matches[0] + '\n\n  useEffect(() => {');
  fs.writeFileSync(path, content);
  console.log('Fixed StoreFront');
} else {
  console.log('No matches');
}
