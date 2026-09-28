const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/ContactUs.jsx', 'utf-8');

// Replace standard filenames with cache-busted ones
content = content.replace(/\/contact-slider-1\.jpg(\?v=\d+)?/g, '/contact-slider-1.jpg?v=2');
content = content.replace(/\/contact-slider-2\.jpg(\?v=\d+)?/g, '/contact-slider-2.jpg?v=2');
content = content.replace(/\/contact-slider-3\.jpg(\?v=\d+)?/g, '/contact-slider-3.jpg?v=2');

fs.writeFileSync('frontend/src/pages/ContactUs.jsx', content, 'utf-8');
console.log('Added cache buster to images');
