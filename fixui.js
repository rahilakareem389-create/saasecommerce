const fs = require('fs');
let data = fs.readFileSync('frontend/src/pages/AdminInventory.jsx', 'utf8');

const startStr = '{isEditing ? (';
const endStr = ') : (';

const firstMatch = data.indexOf(startStr);
const nextMarker = data.indexOf(endStr, firstMatch);

const before = data.substring(0, firstMatch);
const after = data.substring(nextMarker);

const newStr = `{isEditing ? (
                      <div className="space-y-2">
                        {editVariants.map((v, idx) => (
                          <div key={idx} className="flex flex-wrap items-center gap-2 text-xs bg-slate-50 dark:bg-[#2a2a3c] p-2 rounded border mb-2">
                            <label className="cursor-pointer w-8 h-8 rounded border-dashed border border-slate-300 flex items-center justify-center overflow-hidden bg-white hover:bg-slate-100 transition-colors" title="Upload Image">
                              {v.image || v.imageUrl ? <img src={v.image || v.imageUrl} className="w-full h-full object-cover" /> : <span className="text-[10px] text-slate-400">+</span>}
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleVariantImageUpload(e, idx)} />
                            </label>
                            <input type="text" placeholder="Size" value={v.size || ''} onChange={e => updateVariantField(idx, 'size', e.target.value)} className="w-12 border rounded px-1 py-1 dark:bg-[#1f1f2e] dark:border-slate-700 text-xs" />
                            <div className="flex items-center gap-1 border rounded px-1 py-1 bg-white dark:bg-[#1f1f2e] dark:border-slate-700">
                              <input type="text" placeholder="Color Name" value={v.color || ''} onChange={e => updateVariantField(idx, 'color', e.target.value)} className="w-16 outline-none bg-transparent text-xs" />
                              <input type="color" value={v.colorHex || '#000000'} onChange={e => updateVariantField(idx, 'colorHex', e.target.value)} className="w-4 h-4 border-0 p-0 cursor-pointer bg-transparent rounded-full" title="Color Picker" />
                            </div>
                            <input type="number" placeholder="Qty" value={v.stock} onChange={e => updateVariantStock(idx, e.target.value)} className="w-12 border rounded px-1 py-1 dark:bg-[#1f1f2e] dark:border-slate-700 text-xs" />
                            <button onClick={() => removeVariant(idx)} className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-1 rounded transition-colors ml-auto flex items-center justify-center" title="Remove">
                              <span className="font-bold text-sm leading-none">X</span>
                            </button>
                          </div>
                        ))}
                        <button onClick={addVariant} className="text-xs text-primary-600 font-medium hover:underline mt-1 inline-block">+ Add Variant</button>
                      </div>
                    `;

fs.writeFileSync('frontend/src/pages/AdminInventory.jsx', before + newStr + after);
