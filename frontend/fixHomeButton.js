const fs = require('fs');
let content = fs.readFileSync('f:/internship/New folder (2)/ecommerce/frontend/src/pages/Home.jsx', 'utf8');

content = content.replace(/<Link[^>]+to=\{\/product\/\$\{prod\._id\}\}[^>]*>\s*<ShoppingBag size=\{20\} \/>[\s\S]*?<\/Link>/, 
  <button onClick={(e) => { e.preventDefault(); addToCart(prod, 1); navigate('/checkout'); }} className="w-10 h-10 bg-white dark:bg-[#2a2a3c]/90 backdrop-blur rounded-full flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-primary-600 hover:bg-white dark:bg-[#2a2a3c] shadow-md transition-all pointer-events-auto group/btn relative">
     <ShoppingBag size={20} />
     <span className="absolute -top-8 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">Add to Cart</span>
   </button>);

fs.writeFileSync('f:/internship/New folder (2)/ecommerce/frontend/src/pages/Home.jsx', content);
