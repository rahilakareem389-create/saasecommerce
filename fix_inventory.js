const fs = require('fs');

let file = 'frontend/src/pages/AdminInventory.jsx';
let data = fs.readFileSync(file, 'utf8');

const regex = /\{\[\.\.\.Array\(Math\.ceil\(filteredProducts\.length \/ itemsPerPage\)\)\]\.map\(\(\_, i\) => \([\s\S]*?\)\)\}/;

const newPagination = `{(() => {
  const total = Math.ceil(filteredProducts.length / itemsPerPage);
  const pages = [];
  for(let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(currentPage - i) <= 1) {
      if (pages.length > 0 && pages[pages.length - 1] !== i - 1) pages.push('...');
      pages.push(i);
    }
  }
  return pages.map((p, idx) => p === '...' ? <span key={"elipsis" + idx} className="px-2 py-1 text-slate-400">...</span> : <button key={p} onClick={() => setCurrentPage(p)} className={\`px-3 py-1 rounded \${currentPage === p ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600"}\`}>{p}</button>);
})()}`;

if (regex.test(data)) {
    data = data.replace(regex, newPagination);
    console.log("Found and replaced pagination in AdminInventory");
}

fs.writeFileSync(file, data);
