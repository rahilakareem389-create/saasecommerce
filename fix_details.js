const fs = require('fs');
let data = fs.readFileSync('frontend/src/pages/ProductDetails.jsx', 'utf8');

const targetRegex = /\{\/\* Variants \/ Color \*\/\}[\s\S]*?(?=\{\/\* Quantity \*\/)/;

const newStr = `{/* Variants / Options */}
          {product.variants?.length > 0 && (
            <div className="mb-8">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Select Option</h4>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setVariant(v)}
                    disabled={v.stock === 0}
                    className={\`flex items-center gap-3 p-2 pr-4 rounded-xl border-2 text-sm font-bold transition-all \${
                      variant === v 
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-md scale-105' 
                        : v.stock === 0 
                          ? 'border-slate-100 dark:border-[#3d3d5c] bg-slate-50 dark:bg-[#1f1f2e] text-slate-300 cursor-not-allowed' 
                          : 'border-slate-200 dark:border-[#3d3d5c] text-slate-600 dark:text-slate-400 hover:border-slate-400 bg-white dark:bg-[#2a2a3c]'
                    }\`}
                  >
                    {/* Variant Image or Color Palette */}
                    {(v.imageUrl || v.colorHex) ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 shadow-sm border border-slate-200 dark:border-slate-700" style={{ backgroundColor: v.colorHex || '#eee' }}>
                        {v.imageUrl && <img src={v.imageUrl} className="w-full h-full object-cover" alt={v.color || v.size} />}
                      </div>
                    ) : null}
                    
                    <div className="flex flex-col text-left">
                      <span className="leading-tight flex items-center gap-2">
                        {v.color && <span>{v.color}</span>}
                        {v.size && <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">{v.size}</span>}
                      </span>
                      {v.stock === 0 ? (
                        <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-0.5">Out of Stock</span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium mt-0.5">{v.stock} Available</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          `;

data = data.replace(targetRegex, newStr);

// Now for the main image, if a variant is selected and has an image, use it!
data = data.replace(
  `<img src={product.imageUrl} alt={product.title} className="max-h-[500px] object-contain hover:scale-105 transition-transform duration-500" />`,
  `<img src={(variant && variant.imageUrl) ? variant.imageUrl : product.imageUrl} alt={product.title} className="max-h-[500px] object-contain hover:scale-105 transition-transform duration-500" />`
);

fs.writeFileSync('frontend/src/pages/ProductDetails.jsx', data);
console.log("Success");
