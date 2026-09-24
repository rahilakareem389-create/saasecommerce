import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Upload, X } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  const { user } = useAuth();
  
  // Form State
  const [title, setTitle] = useState('');
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

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
    setProducts(data);
  };

  const fetchCategories = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/categories`);
    setCategories(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const productData = { 
        title, description, price: Number(price), salePrice: Number(salePrice), 
        imageUrl, images, category, subCategory: subCategory || null, stock: Number(stock), sku, status, isFeatured, isBestSeller, isNewArrival 
      };

      if (editId) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${editId}`, productData, config);
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, productData, config);
      }
      
      fetchProducts();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, config);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting product');
    }
  };

  const handleEdit = (p) => {
    setEditId(p._id);
    setTitle(p.title);
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
    setIsAdding(true);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditId(null);
    setTitle(''); setDescription(''); setPrice(''); setSalePrice('');
    setImageUrl(''); setImages([]); setCategory(''); setSubCategory(''); setStock(''); setSku(''); setStatus('Active'); 
    setIsFeatured(false); setIsBestSeller(false); setIsNewArrival(false);
  };

  const handleImageUpload = (e, setUrl) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUrl(reader.result);
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

  const mainCategories = categories.filter(c => !c.parentCategory);
  const subCategories = categories.filter(c => c.parentCategory === category);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Product Management</h2>
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
        <div className="bg-white p-6 rounded-xl border shadow-sm mb-6">
          <h3 className="font-bold text-lg mb-4">{editId ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Product Name</label>
                <input required type="text" value={title} onChange={e=>setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">SKU</label>
                <input type="text" value={sku} onChange={e=>setSku(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="e.g. TSHIRT-RED-M" />
              </div>
              
              <div className="space-y-1 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <select required value={category} onChange={e=>setCategory(e.target.value)} className="w-full px-3 py-2 border rounded-md">
                    <option value="">Select Main...</option>
                    {mainCategories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Subcategory</label>
                  <select value={subCategory} onChange={e=>setSubCategory(e.target.value)} className="w-full px-3 py-2 border rounded-md" disabled={!category}>
                    <option value="">Optional...</option>
                    {subCategories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1 grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Price ($)</label>
                  <input required type="number" min="0" step="0.01" value={price} onChange={e=>setPrice(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Sale Price ($)</label>
                  <input type="number" step="0.01" value={salePrice} onChange={e=>setSalePrice(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="Optional" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Stock</label>
                  <input required type="number" value={stock} onChange={e=>setStock(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Main Product Image (Upload or URL)</label>
                  <div className="flex gap-2 items-center">
                    <input type="text" value={imageUrl} onChange={e=>setImageUrl(e.target.value)} className="flex-1 px-3 py-2 border rounded-md" placeholder="Image URL or upload file" />
                    <label className="cursor-pointer bg-slate-100 text-slate-700 px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-200 transition-colors flex items-center gap-2">
                      <Upload size={16} /> Upload
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setImageUrl)} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Multiple Additional Images (Optional)</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 border rounded group overflow-hidden bg-slate-50">
                        <img src={img} alt="Additional" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <label className="cursor-pointer w-16 h-16 border-2 border-dashed border-slate-300 rounded flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-primary-400 transition-colors">
                      <Plus size={20} />
                      <span className="text-[10px]">Add More</span>
                      <input type="file" accept="image/*" multiple onChange={handleMultipleImagesUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea required value={description} onChange={e=>setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-md resize-none h-[116px]"></textarea>
              </div>

              <div className="space-y-4 md:col-span-2 p-4 bg-slate-50 rounded-lg border flex flex-wrap gap-6 items-center">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full px-3 py-1.5 border rounded-md bg-white">
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2 mt-5">
                  <input type="checkbox" id="featured" checked={isFeatured} onChange={e=>setIsFeatured(e.target.checked)} className="rounded w-4 h-4 text-primary-600 focus:ring-primary-500" />
                  <label htmlFor="featured" className="text-sm font-medium text-slate-700">Featured</label>
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <input type="checkbox" id="bestseller" checked={isBestSeller} onChange={e=>setIsBestSeller(e.target.checked)} className="rounded w-4 h-4 text-primary-600 focus:ring-primary-500" />
                  <label htmlFor="bestseller" className="text-sm font-medium text-slate-700">Best Seller</label>
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <input type="checkbox" id="newarrival" checked={isNewArrival} onChange={e=>setIsNewArrival(e.target.checked)} className="rounded w-4 h-4 text-primary-600 focus:ring-primary-500" />
                  <label htmlFor="newarrival" className="text-sm font-medium text-slate-700">New Arrival</label>
                </div>
              </div>

            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button type="button" onClick={resetForm} className="px-6 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
              <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                {editId ? 'Update Product' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 border-b">
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
            {products.map(product => (
              <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.title} className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-slate-100 rounded" />
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.title}
                    {product.isFeatured && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Featured</span>}
                    {product.isBestSeller && <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Best Seller</span>}
                    {product.isNewArrival && <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">New</span>}
                  </div>
                  {product.sku && <div className="text-xs text-slate-500 font-mono mt-1">SKU: {product.sku}</div>}
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
        </table>
      </div>
    </div>
  );
}
