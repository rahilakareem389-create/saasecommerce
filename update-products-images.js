const fs = require('fs');

const path = 'frontend/src/utils/productsData.js';
let content = fs.readFileSync(path, 'utf8');

// Replace Unsplash links with local main images for realisticProducts

content = content.replace(
  /"https:\/\/images.unsplash.com\/photo-1515886657613-9f3515b0c78f\?w=400&q=80"/g,
  `"/Casual Cotton Sundress/main.jpg"`
);

content = content.replace(
  /"https:\/\/images.unsplash.com\/photo-1572804013309-59a88b7e92f1\?w=400&q=80"/g,
  `"/Casual Cotton Sundress/main.jpg"`
);

content = content.replace(
  /"https:\/\/images.unsplash.com\/photo-1566174053879-31528523f8ae\?w=400&q=80"/g,
  `"/Casual Cotton Sundress/main.jpg"`
);

content = content.replace(
  /"https:\/\/images.unsplash.com\/photo-1556821840-3a63f95609a7\?w=400&q=80"/g,
  `"/Lightweight Windbreaker/main.jpg"`
);

content = content.replace(
  /"https:\/\/images.unsplash.com\/photo-1551028719-00167b16eac5\?w=400&q=80"/g,
  `"/Premium Leather Biker Jacket/main.jpg"`
);

content = content.replace(
  /"https:\/\/images.unsplash.com\/photo-1539533113208-f6df8cc8b543\?w=400&q=80"/g,
  `"/Winter Wool Coat/main.jpg"`
);

content = content.replace(
  /"https:\/\/images.unsplash.com\/photo-1525457136159-887866426370\?w=400&q=80"/g,
  `"/Lightweight Windbreaker/main.jpg"`
);

content = content.replace(
  /"https:\/\/images.unsplash.com\/photo-1584916201218-f4242ceb4809\?w=400&q=80"/g,
  `"/Minimalist Gold Necklace/main.webp"`
);

content = content.replace(
  /"https:\/\/images.unsplash.com\/photo-1511499767150-a48a237f0083\?w=400&q=80"/g,
  `"/Minimalist Gold Necklace/main.webp"`
);

content = content.replace(
  /"https:\/\/images.unsplash.com\/photo-1524805444758-089113d48a6d\?w=400&q=80"/g,
  `"/Minimalist Gold Necklace/main.webp"`
);

content = content.replace(
  /"https:\/\/plus.unsplash.com\/premium_photo-1681276170425-45524c5dd10a\?w=400&q=80"/g,
  `"/Minimalist Gold Necklace/main.webp"`
);

content = content.replace(
  /"https:\/\/images.unsplash.com\/photo-1543163521-1bf539c55dd2\?w=400&q=80"/g,
  `"/Summer Ankle Boots/main.jpg"`
);

content = content.replace(
  /"https:\/\/images.unsplash.com\/photo-1608256246200-53e635b5b65f\?w=400&q=80"/g,
  `"/Summer Ankle Boots/main.jpg"`
);

content = content.replace(
  /"https:\/\/images.unsplash.com\/photo-1525966222134-fcfa99b8ae77\?w=400&q=80"/g,
  `"/Summer Ankle Boots/main.jpg"`
);

content = content.replace(
  /"https:\/\/images.unsplash.com\/photo-1521572163474-6864f9cf17ab\?w=400&q=80"/g,
  `"/Silk Button-Up Blouse/main.jpg"`
);

content = content.replace(
  /"https:\/\/images.unsplash.com\/photo-1564584217132-2271feaeb3c5\?w=400&q=80"/g,
  `"/Silk Button-Up Blouse/main.jpg"`
);

content = content.replace(
  /"https:\/\/images.unsplash.com\/photo-1620799140408-edc6dcb6d633\?w=400&q=80"/g,
  `"/Silk Button-Up Blouse/main.jpg"`
);

content = content.replace(
  /"https:\/\/images.unsplash.com\/photo-1596755094514-f87e32f85e2c\?w=400&q=80"/g,
  `"/Silk Button-Up Blouse/main.jpg"`
);

fs.writeFileSync(path, content);
