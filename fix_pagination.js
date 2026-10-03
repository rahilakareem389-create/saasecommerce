const fs = require('fs');

const file = 'frontend/src/pages/AdminProducts.jsx';
let data = fs.readFileSync(file, 'utf8');

const targetStr = `{[...Array(Math.ceil(products.length / itemsPerPage))].map((_, i) => (<button key={i} onClick={() => setCurrentPage(i + 1)} className={\`px-3 py-1 rounded \${currentPage === i + 1 ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600"}\`}>{i + 1}</button>))}`;

const newStr = `{(() => {
  const total = Math.ceil(products.length / itemsPerPage);
  const pages = [];
  for(let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(currentPage - i) <= 1) {
      if (pages.length > 0 && pages[pages.length - 1] !== i - 1) pages.push('...');
      pages.push(i);
    }
  }
  return pages.map((p, idx) => p === '...' ? <span key={"elipsis" + idx} className="px-2 py-1 text-slate-400">...</span> : <button key={p} onClick={() => setCurrentPage(p)} className={\`px-3 py-1 rounded \${currentPage === p ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600"}\`}>{p}</button>);
})()}`;

data = data.replace(targetStr, newStr);

// To fix the horizontal scrollbar wrapper just in case, I will add 'overflow-x-auto' to the wrapper if it exists without it
data = data.replace('overflow-hidden flex gap-2', 'overflow-hidden overflow-x-auto flex gap-2'); 
// But the issue was the buttons stretching it. The above pagination fix is enough.

fs.writeFileSync(file, data);
console.log('Pagination updated!');
