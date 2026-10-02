import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { cachedGet, getCachedDataSync } from '../utils/apiCache';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Upload, X, MessageSquare } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState(() => getCachedDataSync(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/products`) || null);
  const [categories, setCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  const { user } = useAuth();
  
  // Form State
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [status, setStatus] = useState('Active');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [variants, setVariants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;


  const [qaProduct, setQaProduct] = useState(null);
  const [replyText, setReplyText] = useState({});
  const handleReplyQA = async (productId, questionId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/products/${productId}/questions/${questionId}/answer`, { answer: replyText[questionId] }, config);
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

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const { data } = await cachedGet(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/products`);
    setProducts(data);
  };

  const fetchCategories = async () => {
    const { data } = await cachedGet(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/categories`);
    setCategories(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const productData = { 
        title, shortDescription, description, price: Number(price), salePrice: Number(salePrice), 
        imageUrl, images, category, subCategory: subCategory || null, stock: Number(stock), sku, status, isFeatured, isBestSeller, isNewArrival, variants 
      };

      if (editId) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/products/${editId}`, productData, config);
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/products`, productData, config);
      }
      
      fetchProducts();
      resetForm();
    } catch (err) {
      Swal.fire(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (!(await Swal.fire({title: 'Are you sure?', text: 'Are you sure you want to delete this product?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Yes'})).isConfirmed) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/products/${id}`, config);
      fetchProducts();
    } catch (err) {
      Swal.fire(err.response?.data?.message || 'Error deleting product');
    }
  };

  const handleEdit = (p) => {
    setEditId(p._id);
    setTitle(p.title);
    setShortDescription(p.shortDescription || '');
    setDescription(p.description);
    setPrice(p.price);
    setSalePrice(p.salePrice || '');
    setImageUrl(p.imageUrl);
    setImages(p.images || []);
    setCategory(p.category?._id || p.category);
    setSubCategory(p.subCategory?._id || p.subCategory || '');
    setStock(p.stock);
    setSku(p.sku || '');
    setStatus(p.status || 'Active');
    setIsFeatured(p.isFeatured || false);
    setIsBestSeller(p.isBestSeller || false);
    setIsNewArrival(p.isNewArrival || false);
    setVariants(p.variants || []);
    setIsAdding(true);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditId(null);
    setTitle(''); setShortDescription(''); setDescription(''); setPrice(''); setSalePrice('');
    setImageUrl(''); setImages([]); setCategory(''); setSubCategory(''); setStock(''); setSku(''); setStatus('Active'); 
    setIsFeatured(false); setIsBestSeller(false); setIsNewArrival(false); setVariants([]);
  };

  const handleImageUpload = (e, setUrl) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleVariantImageUpload = (e, idx) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const v = [...variants];
        v[idx].imageUrl = reader.result;
        setVariants(v);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMultipleImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    const promises = files.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(promises).then(base64Images => {
      setImages(prev => [...prev, ...base64Images]);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };


  const handleCreateCategory = async (isSub = false) => {
    const { value: catName } = await Swal.fire({
      title: isSub ? 'New Subcategory' : 'New Category',
      input: 'text',
      inputPlaceholder: 'Enter name...',
      showCancelButton: true
    });
    if(catName) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const payload = { name: catName, description: '', isActive: true };
        if(isSub && category) payload.parentCategory = category;
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/categories`, payload, config);
        setCategories([...categories, res.data]);
        if(isSub) setSubCategory(res.data._id);
        else setCategory(res.data._id);
        Swal.fire('Created', '', 'success');
      } catch(e) {
        Swal.fire('Error', 'Could not create category', 'error');
      }
    }
  };

  const mainCategories = (categories || []); // Show ALL categories
  const subCategories = (categories || []).filter(c => c.parentCategory === category);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Product Management</h2>
        <button 
          onClick={() => {
            if (isAdding) {
              resetForm();
            } else {
              resetForm();
              setIsAdding(true);
            }
          }}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          {isAdding ? 'Cancel' : <><Plus size={18} /> Add New Product</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-[#2a2a3c] p-6 rounded-xl border shadow-sm mb-6">
          <h3 className="font-bold text-lg mb-4">{editId ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Product Name</label>
                <input required type="text" value={title} onChange={e=>setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">SKU</label>
                <input type="text" value={sku} onChange={e=>setSku(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="e.g. TSHIRT-RED-M" />
              </div>
              
              <div className="space-y-1 grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center"><label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label><button type="button" onClick={() => handleCreateCategory(false)} className="text-xs text-primary-600 hover:underline font-bold">+ New</button></div>
                  <select required value={category} onChange={e=>setCategory(e.target.value)} className="w-full px-3 py-2 border rounded-md">
                    <option value="">Select Main...</option>
                    {mainCategories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <div className="flex justify-between items-center"><label className="text-sm font-medium text-slate-700 dark:text-slate-300">Subcategory</label><button type="button" onClick={() => handleCreateCategory(true)} disabled={!category} className="text-xs text-primary-600 hover:underline font-bold disabled:opacity-50">+ New</button></div>
                  <select value={subCategory} onChange={e=>setSubCategory(e.target.value)} className="w-full px-3 py-2 border rounded-md" disabled={!category}>
                    <option value="">Optional...</option>
                    {subCategories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1 grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Price ($)</label>
                  <input required type="number" min="0" step="0.01" value={price} onChange={e=>setPrice(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Sale Price ($)</label>
                  <input type="number" step="0.01" value={salePrice} onChange={e=>setSalePrice(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="Optional" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Stock</label>
                  <input required type="number" value={stock} onChange={e=>setStock(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Main Product Image (Upload or URL)</label>
                  <div className="flex gap-2 items-center">
                    <input type="text" value={imageUrl} onChange={e=>setImageUrl(e.target.value)} className="flex-1 px-3 py-2 border rounded-md" placeholder="Image URL or upload file" />
                    <label className="cursor-pointer bg-slate-100 dark:bg-[#2a2a3c]/50 text-slate-700 dark:text-slate-300 px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-200 dark:bg-slate-700 transition-colors flex items-center gap-2">
                      <Upload size={16} /> Upload
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setImageUrl)} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Multiple Additional Images (Optional)</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 border rounded group overflow-hidden bg-slate-50 dark:bg-[#1f1f2e]">
                        <img src={img} alt="Additional" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <label className="cursor-pointer w-16 h-16 border-2 border-dashed border-slate-300 rounded flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-[#1f1f2e] hover:border-primary-400 transition-colors">
                      <Plus size={20} />
                      <span className="text-[10px]">Add More</span>
                      <input type="file" accept="image/*" multiple onChange={handleMultipleImagesUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Long Description</label>
                <textarea required value={description} onChange={e=>setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-md resize-none h-[116px]"></textarea></div><div className="space-y-1 mt-4"><label className="text-sm font-medium text-slate-700 dark:text-slate-300">Short Description</label><textarea value={shortDescription} onChange={e=>setShortDescription(e.target.value)} className="w-full px-3 py-2 border rounded-md resize-none h-[60px]" placeholder="Brief summary of the product..."></textarea>
              </div>

              <div className="space-y-4 md:col-span-2 p-4 bg-slate-50 dark:bg-[#1f1f2e] rounded-lg border flex flex-wrap gap-6 items-center">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                  <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full px-3 py-1.5 border rounded-md bg-white dark:bg-[#2a2a3c]">
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                
                <label className="flex items-center gap-2 mt-5 cursor-pointer">
                  <input type="checkbox" id="featured" checked={isFeatured} onChange={e=>setIsFeatured(e.target.checked)} className="rounded w-4 h-4 text-primary-600 focus:ring-primary-500 cursor-pointer" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 select-none">Featured</span>
                </label>
                <label className="flex items-center gap-2 mt-5 cursor-pointer">
                  <input type="checkbox" id="bestseller" checked={isBestSeller} onChange={e=>setIsBestSeller(e.target.checked)} className="rounded w-4 h-4 text-primary-600 focus:ring-primary-500 cursor-pointer" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 select-none">Best Seller</span>
                </label>
                <label className="flex items-center gap-2 mt-5 cursor-pointer">
                  <input type="checkbox" id="newarrival" checked={isNewArrival} onChange={e=>setIsNewArrival(e.target.checked)} className="rounded w-4 h-4 text-primary-600 focus:ring-primary-500 cursor-pointer" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 select-none">New Arrival</span>
                </label>
              </div>

              <div className="md:col-span-2 border-t pt-4 mt-2">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Product Variants (Optional)</label>
                  <button type="button" onClick={() => setVariants([...variants, { size: '', color: '', stock: 0 }])} className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-800/50">
                    + Add Variant
                  </button>
                </div>
                {variants.map((variant, index) => (
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
{variants.length === 0 && <p className="text-sm text-slate-400 italic">No variants added. The main product stock will be used.</p>}
              </div>

            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button type="button" onClick={resetForm} className="px-6 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-[#2a2a3c]/50 transition-colors">Cancel</button>
              <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                {editId ? 'Update Product' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-[#2a2a3c] rounded-xl border shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead className="bg-slate-50 dark:bg-[#1f1f2e] text-slate-700 dark:text-slate-300 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold">Image</th>
              <th className="px-6 py-4 font-semibold">Name & SKU</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold">Stock</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products === null ? (
               [...Array(5)].map((_, i) => (
                 <tr key={i} className="animate-pulse hover:bg-slate-50 dark:bg-[#1f1f2e]">
                   <td className="px-6 py-4"><div className="w-12 h-12 bg-slate-200 dark:bg-[#3d3d5c] rounded"></div></td>
                   <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-[#3d3d5c] rounded w-3/4 mb-2"></div><div className="h-3 bg-slate-200 dark:bg-[#3d3d5c] rounded w-1/4"></div></td>
                   <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-[#3d3d5c] rounded w-16"></div></td>
                   <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-[#3d3d5c] rounded w-12"></div></td>
                   <td className="px-6 py-4"><div className="h-6 bg-slate-200 dark:bg-[#3d3d5c] rounded-full w-16"></div></td>
                   <td className="px-6 py-4"><div className="h-8 bg-slate-200 dark:bg-[#3d3d5c] rounded w-24 ml-auto"></div></td>
                 </tr>
               ))
            ) : ((products || []).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)).map(product => (
              <tr key={product._id} className="hover:bg-slate-50 dark:bg-[#1f1f2e] transition-colors">
                <td className="px-6 py-4">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.title} className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-slate-100 dark:bg-[#2a2a3c]/50 rounded" />
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-50">
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.title}
                    {product.isFeatured && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Featured</span>}
                    {product.isBestSeller && <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Best Seller</span>}
                    {product.isNewArrival && <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">New</span>}
                  </div>
                  {product.sku && <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">SKU: {product.sku}</div>}
                </td>
                <td className="px-6 py-4 font-bold">
                  ${product.price}
                  {product.salePrice && <span className="ml-2 text-xs text-red-500 line-through">${product.salePrice}</span>}
                </td>
                <td className="px-6 py-4">
                  <span className={product.stock <= 10 ? 'text-orange-600 font-bold' : ''}>{product.stock}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.status === 'Active' ? 'bg-green-100 text-green-800' : product.status === 'Draft' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'}`}>
                    {product.status || 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => setQaProduct(product)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors relative" title="Q&A">
                    <MessageSquare size={18} />
                    {product.questions?.some(q => !q.answer) && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span></span>}
                  </button>
                  <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>{products && products.length > itemsPerPage && (<div className="flex justify-between items-center mt-4"><div className="text-sm text-slate-500">Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, products.length)} of {products.length} entries</div><div className="flex gap-2"><button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 rounded bg-slate-100 text-slate-600 disabled:opacity-50">Previous</button>{(() => {
  const total = Math.ceil(products.length / itemsPerPage);
  const pages = [];
  for(let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(currentPage - i) <= 1) {
      if (pages.length > 0 && pages[pages.length - 1] !== i - 1) pages.push('...');
      pages.push(i);
    }
  }
  return pages.map((p, idx) => p === '...' ? <span key={"elipsis" + idx} className="px-2 py-1 text-slate-400">...</span> : <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 rounded ${currentPage === p ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600"}`}>{p}</button>);
})()}<button disabled={currentPage === Math.ceil(products.length / itemsPerPage)} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 rounded bg-slate-100 text-slate-600 disabled:opacity-50">Next</button></div></div>)}
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
