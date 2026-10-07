import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { cachedGet, getCachedDataSync } from '../utils/apiCache';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, PackageX, Box, Check, Edit2 } from 'lucide-react';

export default function AdminInventory() {
  const [products, setProducts] = useState(() => getCachedDataSync(`${import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' || window.location.hostname.match(/^192\.168\./) ? `http://${window.location.hostname}:5000` : 'https://saasecommerce-production.up.railway.app')}/api/products`) || []);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // all, low, out
  const [editingId, setEditingId] = useState(null);
  const [editStock, setEditStock] = useState('');
  const [editVariants, setEditVariants] = useState([]);
  const { user } = useAuth();

  const fetchProducts = async () => {
    try {
      const { data } = await cachedGet(`${import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' || window.location.hostname.match(/^192\.168\./) ? `http://${window.location.hostname}:5000` : 'https://saasecommerce-production.up.railway.app')}/api/products`);
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSaveStock = async (product) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' || window.location.hostname.match(/^192\.168\./) ? `http://${window.location.hostname}:5000` : 'https://saasecommerce-production.up.railway.app')}/api/products/${product._id}`, {
        ...product, // keep existing data
        stock: Number(editStock),
        variants: editVariants
      }, config);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      Swal.fire(err.response?.data?.message || 'Error updating stock');
    }
  };

  const startEditing = (product) => {
    setEditingId(product._id);
    setEditStock(product.stock);
    setEditVariants(product.variants || []);
  };

  const updateVariantStock = (idx, newStock) => {
    const updated = [...editVariants];
    updated[idx].stock = Number(newStock);
    setEditVariants(updated);
  };

  const addVariant = () => {
    setEditVariants([...editVariants, { size: '', color: '', stock: 0 }]);
  };
  
  const removeVariant = (idx) => {
    setEditVariants(editVariants.filter((_, i) => i !== idx));
  };

  const handleVariantImageUpload = (e, idx) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = [...editVariants];
        updated[idx].imageUrl = reader.result;
        setEditVariants(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateVariantField = (idx, field, value) => {
    const updated = [...editVariants];
    updated[idx][field] = value;
    setEditVariants(updated);
  };

  const filteredProducts = products.filter(p => {
    if (filter === 'low') return p.stock > 0 && p.stock <= 10;
    if (filter === 'out') return p.stock === 0;
    return true;
  });

  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Inventory Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div onClick={() => setFilter('all')} className={`bg-white dark:bg-[#2a2a3c] p-6 rounded-xl border shadow-sm cursor-pointer transition-all ${filter === 'all' ? 'ring-2 ring-primary-500' : 'hover:border-primary-300'}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Box size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Products</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{products.length}</h3>
            </div>
          </div>
        </div>
        <div onClick={() => setFilter('low')} className={`bg-white dark:bg-[#2a2a3c] p-6 rounded-xl border shadow-sm cursor-pointer transition-all ${filter === 'low' ? 'ring-2 ring-yellow-500' : 'hover:border-yellow-300'}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg"><AlertTriangle size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Low Stock (≤ 10)</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{lowStockCount}</h3>
            </div>
          </div>
        </div>
        <div onClick={() => setFilter('out')} className={`bg-white dark:bg-[#2a2a3c] p-6 rounded-xl border shadow-sm cursor-pointer transition-all ${filter === 'out' ? 'ring-2 ring-red-500' : 'hover:border-red-300'}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg"><PackageX size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Out of Stock</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{outOfStockCount}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#2a2a3c] rounded-xl border shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead className="bg-slate-50 dark:bg-[#1f1f2e] text-slate-700 dark:text-slate-300 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold">Product</th>
              <th className="px-6 py-4 font-semibold">SKU / Status</th>
              <th className="px-6 py-4 font-semibold">Overall Stock</th>
              <th className="px-6 py-4 font-semibold">Variants</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(product => {
              const isEditing = editingId === product._id;
              
              return (
                <tr key={product._id} className={product.stock === 0 ? 'bg-red-50' : 'hover:bg-slate-50 dark:bg-[#1f1f2e]'}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.imageUrl} alt={product.title} className="w-10 h-10 rounded object-cover border" />
                      <span className="font-medium text-slate-900 dark:text-slate-50">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${product.stock === 0 ? 'bg-red-100 text-red-800' : product.stock <= 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {product.stock === 0 ? 'Out of Stock' : product.stock <= 10 ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
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
                    ) : (
                      <span className={`font-bold ${product.stock === 0 ? 'text-red-600' : ''}`}>{product.stock} units</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <div className="space-y-2">
                        {editVariants.map((v, idx) => (
                          <div key={idx} className="flex flex-wrap items-center gap-2 text-xs bg-slate-50 dark:bg-[#2a2a3c] p-2 rounded border mb-2">
                            <label className="cursor-pointer w-8 h-8 rounded border-dashed border border-slate-300 flex items-center justify-center overflow-hidden bg-white hover:bg-slate-100 transition-colors" title="Upload Image">
                              {v.image || v.imageUrl ? <img src={v.image || v.imageUrl} className="w-full h-full object-cover" /> : <span className="text-[10px] text-slate-400">+</span>}
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleVariantImageUpload(e, idx)} />
                            </label>
                            <input type="text" placeholder="Size" value={v.size || ""} onChange={e => updateVariantField(idx, "size", e.target.value)} className="w-12 border rounded px-1 py-1 dark:bg-[#1f1f2e] dark:border-slate-700 text-xs" />
                            <div className="flex items-center gap-1 border rounded px-1 py-1 bg-white dark:bg-[#1f1f2e] dark:border-slate-700">
                              <input type="text" placeholder="Color Name" value={v.color || ""} onChange={e => updateVariantField(idx, "color", e.target.value)} className="w-16 outline-none bg-transparent text-xs" />
                              <input type="color" value={v.colorHex || "#000000"} onChange={e => updateVariantField(idx, "colorHex", e.target.value)} className="w-4 h-4 border-0 p-0 cursor-pointer bg-transparent rounded-full" title="Color Picker" />
                            </div>
                            <input type="number" placeholder="Qty" value={v.stock} onChange={e => updateVariantStock(idx, e.target.value)} className="w-12 border rounded px-1 py-1 dark:bg-[#1f1f2e] dark:border-slate-700 text-xs" />
                            <button onClick={() => removeVariant(idx)} className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-1 rounded transition-colors ml-auto flex items-center justify-center" title="Remove">
                              <span className="font-bold text-sm leading-none">X</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {product.variants?.length > 0 ? product.variants.map((v, i) => (
                          <div key={i} className="text-xs">
                            {v.size && <span className="font-medium">[{v.size}]</span>} {v.color} - <span className={v.stock === 0 ? 'text-red-500 font-bold' : ''}>{v.stock} in stock</span>
                          </div>
                        )) : <span className="text-slate-400 text-xs">No variants</span>}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isEditing ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingId(null)} className="text-xs px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-300">Cancel</button>
                        <button onClick={() => handleSaveStock(product)} className="text-xs px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"><Check size={14}/> Save</button>
                      </div>
                    ) : (
                      <button onClick={() => startEditing(product)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Update Stock">
                        <Edit2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        
        </table>
        {filteredProducts.length > itemsPerPage && (
          <div className="flex justify-between items-center mt-4 p-4 border-t">
            <div className="text-sm text-slate-500">Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} entries</div>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 rounded bg-slate-100 text-slate-600 disabled:opacity-50">Previous</button>
              {(() => {
  const total = Math.ceil(filteredProducts.length / itemsPerPage);
  const pages = [];
  for(let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(currentPage - i) <= 1) {
      if (pages.length > 0 && pages[pages.length - 1] !== i - 1) pages.push('...');
      pages.push(i);
    }
  }
  return pages.map((p, idx) => p === '...' ? <span key={"elipsis" + idx} className="px-2 py-1 text-slate-400">...</span> : <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 rounded ${currentPage === p ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600"}`}>{p}</button>);
})()}
              <button disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 rounded bg-slate-100 text-slate-600 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}






