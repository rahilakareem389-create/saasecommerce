const fs = require('fs');
let data = fs.readFileSync('frontend/src/pages/AdminProducts.jsx', 'utf8');

const startMarker = '{variants.map((variant, index) => (';
const endMarker = '{variants.length === 0 && <p className="text-sm text-slate-400 italic">No variants added. The main product stock will be used.</p>}';

const firstMatch = data.indexOf(startMarker);
if (firstMatch === -1) {
    console.error("No start marker found");
    process.exit(1);
}
const endIdx = data.indexOf(endMarker);

const before = data.substring(0, firstMatch);
const after = data.substring(endIdx);

const newStr = `{variants.map((variant, index) => (
  <div key={index} className="flex flex-wrap items-end gap-3 mb-3 bg-slate-50 dark:bg-[#2a2a3c] p-3 rounded-lg border">
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-500">Image</label>
      <label className="cursor-pointer w-[38px] h-[38px] rounded border-dashed border border-slate-300 flex items-center justify-center overflow-hidden bg-white hover:bg-slate-100 transition-colors" title="Upload Image">
        {variant.image || variant.imageUrl ? <img src={variant.image || variant.imageUrl} className="w-full h-full object-cover" /> : <span className="text-xs text-slate-400">+</span>}
        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const v = [...variants];
              v[index].imageUrl = reader.result;
              setVariants(v);
            };
            reader.readAsDataURL(file);
          }
        }} />
      </label>
    </div>
    
    <div className="flex-1 space-y-1 min-w-[80px]">
      <label className="text-xs font-medium text-slate-500">Color Name</label>
      <input type="text" value={variant.color || ''} onChange={e => { const v = [...variants]; v[index].color = e.target.value; setVariants(v); }} className="w-full px-2 py-2 border rounded-md text-sm dark:bg-[#1f1f2e] dark:border-slate-700 dark:text-slate-200" placeholder="e.g. Red" />
    </div>

    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-500">Palette</label>
      <input type="color" value={variant.colorHex || '#000000'} onChange={e => { const v = [...variants]; v[index].colorHex = e.target.value; setVariants(v); }} className="w-[38px] h-[38px] border-0 p-0 cursor-pointer rounded-md bg-transparent" title="Color Picker" />
    </div>

    <div className="flex-1 space-y-1 min-w-[80px]">
      <label className="text-xs font-medium text-slate-500">Size</label>
      <input type="text" value={variant.size || ''} onChange={e => { const v = [...variants]; v[index].size = e.target.value; setVariants(v); }} className="w-full px-2 py-2 border rounded-md text-sm dark:bg-[#1f1f2e] dark:border-slate-700 dark:text-slate-200" placeholder="e.g. XL" />
    </div>

    <div className="flex-1 space-y-1 min-w-[80px]">
      <label className="text-xs font-medium text-slate-500">Stock</label>
      <input type="number" min="0" value={variant.stock || 0} onChange={e => { const v = [...variants]; v[index].stock = Number(e.target.value); setVariants(v); }} className="w-full px-2 py-2 border rounded-md text-sm dark:bg-[#1f1f2e] dark:border-slate-700 dark:text-slate-200" />
    </div>

    <button type="button" onClick={() => { const v = variants.filter((_, i) => i !== index); setVariants(v); }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md h-[38px] w-[38px] flex items-center justify-center border border-transparent hover:border-red-100 dark:hover:border-red-900/30 ml-auto">
      <span className="font-bold">X</span>
    </button>
  </div>
))}
`;

fs.writeFileSync('frontend/src/pages/AdminProducts.jsx', before + newStr + after);
console.log("Success");
