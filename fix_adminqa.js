const fs = require('fs');
let data = fs.readFileSync('frontend/src/pages/AdminProducts.jsx', 'utf8');

// 1. Add MessageSquare to lucide-react import
data = data.replace(
  "import { Plus, Edit2, Trash2, Search, Filter, Tag, LayoutDashboard, ShoppingBag, DollarSign, X } from 'lucide-react';",
  "import { Plus, Edit2, Trash2, Search, Filter, Tag, LayoutDashboard, ShoppingBag, DollarSign, X, MessageSquare } from 'lucide-react';"
);

// 2. Add state for Q&A modal
const stateInsert = `
  const [qaProduct, setQaProduct] = useState(null);
  const [replyText, setReplyText] = useState({});
  const handleReplyQA = async (productId, questionId) => {
    try {
      const config = { headers: { Authorization: \`Bearer \${user.token}\` } };
      await axios.post(\`\${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}/api/products/\${productId}/questions/\${questionId}/answer\`, { answer: replyText[questionId] }, config);
      Swal.fire('Replied', '', 'success');
      setReplyText(prev => ({...prev, [questionId]: ''}));
      // refresh products
      fetchProducts();
      // refresh modal product
      const p = products.find(p => p._id === productId);
      if(p) {
        const updatedQ = p.questions.map(q => q._id === questionId ? {...q, answer: replyText[questionId]} : q);
        setQaProduct({...p, questions: updatedQ});
      }
    } catch(err) {
      Swal.fire('Error', 'Could not reply', 'error');
    }
  };
`;
data = data.replace("  useEffect(() => {", stateInsert + "\n  useEffect(() => {");

// 3. Add Q&A button in actions
const actionRegex = /<button onClick=\{\(\) => handleEdit\(p\)\}.*?<\/button>/;
const btnMatch = data.match(actionRegex);
if(btnMatch) {
  const newBtn = `<button onClick={() => setQaProduct(p)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Q&A">
                            <MessageSquare size={18} />
                            {p.questions?.some(q => !q.answer) && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span></span>}
                          </button>\n                          ` + btnMatch[0];
  data = data.replace(btnMatch[0], newBtn);
}

// 4. Add Q&A Modal at the end
const modalStr = `
      {qaProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setQaProduct(null)}></div>
          <div className="relative bg-white dark:bg-[#2a2a3c] rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Q&A for: {qaProduct.title}</h2>
              <button onClick={() => setQaProduct(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              {(!qaProduct.questions || qaProduct.questions.length === 0) ? (
                <p className="text-center text-slate-500">No questions for this product yet.</p>
              ) : (
                qaProduct.questions.map(q => (
                  <div key={q._id} className="p-4 border border-slate-100 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-[#1f1f2e]">
                    <p className="font-bold text-slate-800 dark:text-slate-200"><span className="text-blue-500">Q:</span> {q.question}</p>
                    <p className="text-xs text-slate-400 mb-2">From: {q.user} | {new Date(q.date).toLocaleDateString()}</p>
                    {q.answer ? (
                      <div className="mt-2 pl-4 border-l-2 border-green-500">
                        <p className="text-sm text-slate-700 dark:text-slate-300"><span className="text-green-500 font-bold">A:</span> {q.answer}</p>
                      </div>
                    ) : (
                      <div className="mt-3 flex gap-2">
                        <input type="text" placeholder="Type your reply..." value={replyText[q._id] || ''} onChange={e => setReplyText({...replyText, [q._id]: e.target.value})} className="flex-1 px-3 py-2 border rounded-lg text-sm dark:bg-[#2a2a3c] dark:border-slate-700 dark:text-white" />
                        <button onClick={() => handleReplyQA(qaProduct._id, q._id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Reply</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;
data = data.replace(/<\/div>\s*<\/div>\s*\);\s*\}\s*$/, `</div>` + modalStr);

fs.writeFileSync('frontend/src/pages/AdminProducts.jsx', data);
console.log("Success");
