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
      let modified = false;
      
      // We will look for: ${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}
      // And replace it with: ${String(import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app").replace(/\/+$/, "")}
      
      const searchStr = '${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}';
      const replaceStr = '${String(import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app").replace(/\\/+$/, "")}';
      
      if (content.includes(searchStr)) {
        content = content.split(searchStr).join(replaceStr);
        fs.writeFileSync(fullPath, content);
        modified = true;
      }
      
      // Also check if they already have some trailing slash fixes that got messed up
      if (modified) {
        console.log('Fixed trailing slash in', fullPath);
      }
    }
  });
};

replaceInDir('f:/internship/New folder (2)/ecommerce/frontend/src');
