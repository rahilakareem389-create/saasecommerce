const fs = require('fs');
const filePath = 'f:/internship/New folder (2)/ecommerce/frontend/src/pages/Home.jsx';
let content = fs.readFileSync(filePath, 'utf-8');

const catchBlockRegex = /} catch \(error\) \{\s*console.error\("Failed to fetch product data", error\);\s*\}/;
const newCatchBlock = } catch (error) {
        console.error("Failed to fetch product data", error);
        setProducts(realisticProducts);
      };

content = content.replace(catchBlockRegex, newCatchBlock);
fs.writeFileSync(filePath, content, 'utf-8');
