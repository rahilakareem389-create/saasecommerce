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
      if (content.includes('import.meta.env.VITE_BACKEND_URL')) {
        // Replace with fallback
        content = content.replace(/\$\{import\.meta\.env\.VITE_BACKEND_URL\}/g, '${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}');
        fs.writeFileSync(fullPath, content);
        console.log('Updated fallback in', fullPath);
      }
    }
  });
};

replaceInDir('f:/internship/New folder (2)/ecommerce/frontend/src');
