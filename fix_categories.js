const fs = require('fs');

let file = 'frontend/src/pages/AdminCategories.jsx';
let data = fs.readFileSync(file, 'utf8');

if (!data.includes('const [currentPage, setCurrentPage] = useState(1);')) {
  data = data.replace(
    "const [parentCategory, setParentCategory] = useState('');",
    "const [parentCategory, setParentCategory] = useState('');\n  const [currentPage, setCurrentPage] = useState(1);\n  const itemsPerPage = 3;"
  );
}

data = data.replace(
  ") : (categories || []).map(cat => (",
  ") : (categories || []).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(cat => ("
);

const paginationMarkup = `</table>
        {categories && categories.length > itemsPerPage && (
          <div className="flex justify-between items-center mt-4 p-4 border-t">
            <div className="text-sm text-slate-500">Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, categories.length)} of {categories.length} entries</div>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 rounded bg-slate-100 text-slate-600 disabled:opacity-50">Previous</button>
              {(() => {
                const total = Math.ceil(categories.length / itemsPerPage);
                const pages = [];
                for(let i = 1; i <= total; i++) {
                  if (i === 1 || i === total || Math.abs(currentPage - i) <= 1) {
                    if (pages.length > 0 && pages[pages.length - 1] !== i - 1) pages.push('...');
                    pages.push(i);
                  }
                }
                return pages.map((p, idx) => p === '...' ? <span key={"elipsis" + idx} className="px-2 py-1 text-slate-400">...</span> : <button key={p} onClick={() => setCurrentPage(p)} className={\`px-3 py-1 rounded \${currentPage === p ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600"}\`}>{p}</button>);
              })()}
              <button disabled={currentPage === Math.ceil(categories.length / itemsPerPage)} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 rounded bg-slate-100 text-slate-600 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}`;

if (!data.includes('Showing {(currentPage - 1) * itemsPerPage + 1}')) {
  data = data.replace('</table>', paginationMarkup);
}

fs.writeFileSync(file, data);
console.log('Fixed categories pagination');
