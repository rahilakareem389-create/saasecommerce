const fs = require('fs');
let data = fs.readFileSync('frontend/src/pages/ProductDetails.jsx', 'utf8');

const targetStr = `{/* Reviews Section */}`;

const newSection = `
        {/* Q&A Section */}
        <div className="bg-white dark:bg-[#2a2a3c] p-8 md:p-12 rounded-3xl border border-slate-100 dark:border-[#3d3d5c] shadow-sm mb-12">
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
            Product Q&A
          </h3>
          <div className="space-y-6">
            {/* Ask a Question */}
            <form onSubmit={async (e) => {
              e.preventDefault();
              const q = e.target.question.value;
              if(!q) return;
              try {
                const res = await axios.post(\`\${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}/api/products/\${product._id}/questions\`, { question: q, user: user?.name || 'Guest' });
                setProduct(res.data);
                e.target.reset();
              } catch(err) { console.error(err); }
            }} className="flex gap-2">
              <input name="question" type="text" placeholder="Have a question? Ask here..." className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-[#1f1f2e] dark:text-white" required />
              <button type="submit" className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-700">Ask</button>
            </form>
            
            {/* Questions List */}
            <div className="space-y-4">
              {product.questions?.length > 0 ? product.questions.map((q, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-[#1f1f2e]">
                  <p className="font-bold text-slate-800 dark:text-slate-200"><span className="text-primary-600">Q:</span> {q.question}</p>
                  <p className="text-xs text-slate-400 mb-2">Asked by {q.user} on {new Date(q.date).toLocaleDateString()}</p>
                  {q.answer ? (
                    <div className="pl-4 border-l-2 border-green-500 mt-2">
                      <p className="text-slate-700 dark:text-slate-300"><span className="text-green-600 font-bold">A:</span> {q.answer}</p>
                      <p className="text-xs text-slate-400 mt-1">Answered by Admin</p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic mt-2">Waiting for admin reply...</p>
                  )}
                </div>
              )) : <p className="text-slate-500">No questions yet. Be the first to ask!</p>}
            </div>
          </div>
        </div>

        {/* Reviews Section */}`;

data = data.replace(targetStr, newSection);

fs.writeFileSync('frontend/src/pages/ProductDetails.jsx', data);
console.log("Success");
