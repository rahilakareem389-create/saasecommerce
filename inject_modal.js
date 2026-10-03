const fs = require('fs');
let data = fs.readFileSync('F:/internship/New folder (2)/ecommerce/frontend/src/pages/AdminProducts.jsx', 'utf8');

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

data = data.replace(/<\/div>\s*\);\s*\}\s*$/, `</div>` + modalStr);

fs.writeFileSync('F:/internship/New folder (2)/ecommerce/frontend/src/pages/AdminProducts.jsx', data);
console.log('Success');
