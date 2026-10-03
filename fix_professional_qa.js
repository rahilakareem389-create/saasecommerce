const fs = require('fs');
let data = fs.readFileSync('frontend/src/pages/ProductDetails.jsx', 'utf8');

const targetRegex = /\{\/\* Q&A Section \*\/\}[\s\S]*?(?=\{\/\* Reviews Section \*\/)/;

const newSection = `{/* Q&A Section */}
        <div className="bg-white dark:bg-[#2a2a3c] p-8 md:p-12 rounded-3xl border border-slate-100 dark:border-[#3d3d5c] shadow-sm mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-[120px] opacity-10"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <i className="fas fa-comments text-primary-500"></i> Customer Q&A
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Have a question about this product? Ask our team!</p>
            </div>
          </div>
          
          <div className="space-y-8 relative z-10">
            {/* Ask a Question Box */}
            <div className="bg-slate-50 dark:bg-[#1f1f2e] p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
              <form onSubmit={async (e) => {
                e.preventDefault();
                const q = e.target.question.value;
                if(!q) return;
                
                // Show loading
                Swal.fire({
                  title: 'Submitting...',
                  text: 'Please wait while we post your question.',
                  allowOutsideClick: false,
                  didOpen: () => Swal.showLoading()
                });

                try {
                  const res = await axios.post(\`\${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}/api/products/\${product._id}/questions\`, { 
                    question: q, 
                    user: user?.name || 'Guest User' 
                  });
                  setProduct(res.data);
                  e.target.reset();
                  
                  Swal.fire({
                    icon: 'success',
                    title: 'Question Posted!',
                    text: 'Your question has been submitted. Our team will answer it shortly.',
                    timer: 2000,
                    showConfirmButton: false
                  });
                } catch(err) { 
                  console.error(err); 
                  Swal.fire('Error', 'Failed to submit question.', 'error');
                }
              }} className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 dark:text-slate-300 text-sm">Post a Question</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    name="question" 
                    type="text" 
                    placeholder="e.g., What is the exact material used in this product?" 
                    className="flex-1 px-5 py-4 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-[#2a2a3c] dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm" 
                    required 
                  />
                  <button type="submit" className="bg-primary-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-700 transition-all hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2 whitespace-nowrap">
                    <i className="fas fa-paper-plane"></i> Ask Question
                  </button>
                </div>
              </form>
            </div>
            
            {/* Questions List */}
            <div className="space-y-6">
              {product.questions?.length > 0 ? [...product.questions].reverse().map((q, idx) => (
                <div key={idx} className="flex gap-4 p-6 rounded-2xl border border-slate-100 dark:border-[#3d3d5c] bg-white dark:bg-[#2a2a3c] shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold shrink-0 text-lg uppercase">
                    {q.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-black text-slate-800 dark:text-slate-200 text-lg">{q.question}</p>
                      <span className="text-xs text-slate-400 whitespace-nowrap ml-4">{new Date(q.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-4 font-medium uppercase tracking-wider">Asked by {q.user}</p>
                    
                    {q.answer ? (
                      <div className="bg-slate-50 dark:bg-[#1f1f2e] p-4 rounded-xl border-l-4 border-primary-500 mt-2 relative">
                        <div className="absolute -left-[2px] top-4 w-4 h-4 bg-primary-500 rounded-full border-4 border-white dark:border-[#2a2a3c] -translate-x-1/2"></div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-primary-500 text-white text-[10px] px-2 py-0.5 rounded font-bold tracking-wider uppercase">Store Admin</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium">{q.answer}</p>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold">
                        <i className="fas fa-clock"></i> Waiting for admin reply...
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 text-2xl">
                    <i className="fas fa-question"></i>
                  </div>
                  <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">No Questions Yet</h4>
                  <p className="text-slate-500">Be the first to ask a question about this product!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        `;

data = data.replace(targetRegex, newSection);

fs.writeFileSync('frontend/src/pages/ProductDetails.jsx', data);
console.log("Success");
