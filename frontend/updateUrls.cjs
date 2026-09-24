const fs = require('fs');
const path = require('path');

const replaceInDir = (dir) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('https://saasecommerce.vercel.app')) {
        // Simple replace
        content = content.replace(/['"`]https:\/\/saasecommerce\.vercel\.app(.*?)['"`]/g, '`${import.meta.env.VITE_BACKEND_URL}$1`');
        fs.writeFileSync(fullPath, content);
        console.log('Updated', fullPath);
      }
    }
  });
};

replaceInDir('f:/internship/New folder (2)/ecommerce/frontend/src');
