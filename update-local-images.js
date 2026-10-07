const fs = require('fs');

const path = 'frontend/src/pages/Home.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /{ name: 'DRESSES', img: '[^']+' }/g,
  `{ name: 'DRESSES', img: '/Casual Cotton Sundress/main.jpg' }`
);

content = content.replace(
  /{ name: 'OUTERWEAR', img: '[^']+' }/g,
  `{ name: 'OUTERWEAR', img: '/Premium Leather Biker Jacket/main.jpg' }`
);

content = content.replace(
  /{ name: 'ACCESSORIES', img: '[^']+' }/g,
  `{ name: 'ACCESSORIES', img: '/Minimalist Gold Necklace/main.webp' }`
);

content = content.replace(
  /{ name: 'SHOES', img: '[^']+' }/g,
  `{ name: 'SHOES', img: '/Summer Ankle Boots/main.jpg' }`
);

content = content.replace(
  /{ name: 'TOPS', img: '[^']+' }/g,
  `{ name: 'TOPS', img: '/Silk Button-Up Blouse/main.jpg' }`
);

fs.writeFileSync(path, content);
