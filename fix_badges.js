const fs = require('fs');
let data = fs.readFileSync('frontend/src/pages/StoreFront.jsx', 'utf8');

const targetStr = `<div className="aspect-square bg-slate-50 dark:bg-[#1f1f2e] rounded-xl mb-4 overflow-hidden relative group">`;

const replaceStr = `<div className="aspect-square bg-slate-50 dark:bg-[#1f1f2e] rounded-xl mb-4 overflow-hidden relative group">
                  {p.isNewArrival && <span className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded z-10 shadow-lg">New Arrival</span>}`;

// Use global regex to replace all instances of product card images
data = data.replace(/<div className="aspect-square bg-slate-50 dark:bg-\[#1f1f2e\] rounded-xl mb-4 overflow-hidden relative group">/g, replaceStr);

fs.writeFileSync('frontend/src/pages/StoreFront.jsx', data);
console.log("Success");
