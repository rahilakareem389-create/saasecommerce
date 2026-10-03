const fs = require('fs');
let data = fs.readFileSync('frontend/src/pages/StoreFront.jsx', 'utf8');

const targetStr = `const matchCategory = selectedCategory 
        ? (
            p.category?._id === selectedCategory || 
            p.category?.name?.toLowerCase().replace(/[-_\\s]+/g, '') === selectedCategory.toLowerCase().replace(/[-_\\s]+/g, '') || 
            (typeof p.category === 'string' && p.category.toLowerCase().replace(/[-_\\s]+/g, '') === selectedCategory.toLowerCase().replace(/[-_\\s]+/g, ''))
          ) 
        : true;`;

// Wait, the regex replace is safer
const regexStr = /const matchCategory = selectedCategory\s*\?\s*\([\s\S]*?\)\s*: true;/;

const newStr = `const matchCategory = selectedCategory 
        ? (
            p.category?._id === selectedCategory || 
            p.subCategory?._id === selectedCategory ||
            p.category?.name?.toLowerCase().replace(/[-_\\s]+/g, '') === selectedCategory.toLowerCase().replace(/[-_\\s]+/g, '') || 
            p.subCategory?.name?.toLowerCase().replace(/[-_\\s]+/g, '') === selectedCategory.toLowerCase().replace(/[-_\\s]+/g, '') || 
            (typeof p.category === 'string' && p.category.toLowerCase().replace(/[-_\\s]+/g, '') === selectedCategory.toLowerCase().replace(/[-_\\s]+/g, '')) ||
            (typeof p.subCategory === 'string' && p.subCategory.toLowerCase().replace(/[-_\\s]+/g, '') === selectedCategory.toLowerCase().replace(/[-_\\s]+/g, ''))
          ) 
        : true;`;

data = data.replace(regexStr, newStr);

fs.writeFileSync('frontend/src/pages/StoreFront.jsx', data);
console.log("Fixed StoreFront filter");
