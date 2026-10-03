const fs = require('fs');
let data = fs.readFileSync('frontend/src/pages/StoreFront.jsx', 'utf8');

const replacementStr = `            {[{_id: '', name: 'ALL PRODUCTS', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80'}, ...categories].map((c, i) => {
              const displayImg = c.img || c.imageUrl || fashionImages[i % fashionImages.length];
              return (
              <button key={c._id || 'all'} onClick={() => setSelectedCategory(c._id)} className={\`min-w-[140px] h-[160px] rounded-2xl relative overflow-hidden group snap-start border-4 transition-all \${selectedCategory === c._id ? 'border-primary-600 shadow-xl scale-105' : 'border-transparent hover:border-primary-300'}\`}>
                <img src={displayImg} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                <span className="absolute inset-0 flex items-center justify-center text-white font-black tracking-widest text-sm drop-shadow-md z-10 text-center px-2 uppercase">{c.name}</span>
              </button>
            )})}
`;

// regex replace from `{[{_id: '', name: 'ALL PRODUCTS'` to `))} `
data = data.replace(/\{\[\{_id: '', name: 'ALL PRODUCTS'[\s\S]*?\)\}\}/, replacementStr.trim());

fs.writeFileSync('frontend/src/pages/StoreFront.jsx', data);
console.log("Success");
