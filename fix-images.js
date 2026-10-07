const fs = require('fs');

const path = 'frontend/src/pages/Home.jsx';
let content = fs.readFileSync(path, 'utf8');

// The original ones are hardcoded in Home.jsx like this:
// { name: 'DRESSES', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80' }
// { name: 'OUTERWEAR', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=80' }
// { name: 'ACCESSORIES', img: 'https://images.unsplash.com/photo-1599643478524-fb66f7240078?w=200&q=80' }
// { name: 'SHOES', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&q=80' }
// { name: 'TOPS', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&q=80' }

// Re-write the map array
content = content.replace(
  /{ name: 'DRESSES', img: 'https:\/\/images.unsplash.com\/photo-1595777457583-95e059d581b8\?w=200&q=80' }/,
  `{ name: 'DRESSES', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80' }`
);

content = content.replace(
  /{ name: 'OUTERWEAR', img: 'https:\/\/images.unsplash.com\/photo-1556821840-3a63f95609a7\?w=200&q=80' }/,
  `{ name: 'OUTERWEAR', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80' }`
);

content = content.replace(
  /{ name: 'ACCESSORIES', img: 'https:\/\/images.unsplash.com\/photo-1599643478524-fb66f7240078\?w=200&q=80' }/,
  `{ name: 'ACCESSORIES', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400&q=80' }`
);

content = content.replace(
  /{ name: 'SHOES', img: 'https:\/\/images.unsplash.com\/photo-1543163521-1bf539c55dd2\?w=200&q=80' }/,
  `{ name: 'SHOES', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80' }`
);

content = content.replace(
  /{ name: 'TOPS', img: 'https:\/\/images.unsplash.com\/photo-1515886657613-9f3515b0c78f\?w=200&q=80' }/,
  `{ name: 'TOPS', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' }`
);

fs.writeFileSync(path, content);
