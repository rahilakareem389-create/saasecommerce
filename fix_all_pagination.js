const fs = require('fs');
const path = require('path');

const dir = 'F:/internship/New folder (2)/ecommerce/frontend/src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let data = fs.readFileSync(filePath, 'utf8');
  let originalData = data;

  // Regex to find [...Array(Math.ceil(ARRAY.length / itemsPerPage))].map((_, i) => ... {i + 1}</button>))
  const regex = /\{\[\.\.\.Array\(Math\.ceil\(([\w\.]+)\s*\/\s*itemsPerPage\)\)\]\.map\(\(\_,\s*i\)\s*=>\s*\(\<button key=\{i\} onClick=\{\(\)\s*=>\s*setCurrentPage\(i\s*\+\s*1\)\}\s*className=\{`px-3 py-1 rounded \$\{currentPage === i\s*\+\s*1 \? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600"\}`\}\>\{i\s*\+\s*1\}\<\/button\>\)\)\}/g;

  data = data.replace(regex, (match, arrLen) => {
    return `{(() => {
  const total = Math.ceil(${arrLen} / itemsPerPage);
  const pages = [];
  for(let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(currentPage - i) <= 1) {
      if (pages.length > 0 && pages[pages.length - 1] !== i - 1) pages.push('...');
      pages.push(i);
    }
  }
  return pages.map((p, idx) => p === '...' ? <span key={"elipsis" + idx} className="px-2 py-1 text-slate-400">...</span> : <button key={p} onClick={() => setCurrentPage(p)} className={\`px-3 py-1 rounded \${currentPage === p ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600"}\`}>{p}</button>);
})()}`;
  });

  // also replace overflow-hidden flex gap-2 with overflow-x-auto flex gap-2 if any, or just rounded-xl border shadow-sm overflow-hidden
  data = data.replace(/rounded-xl border shadow-sm overflow-hidden/g, 'rounded-xl border shadow-sm overflow-x-auto');

  if (data !== originalData) {
    fs.writeFileSync(filePath, data);
    console.log('Fixed pagination in', file);
  }
});
