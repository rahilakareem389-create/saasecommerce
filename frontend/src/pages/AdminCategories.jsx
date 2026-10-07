import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { cachedGet, getCachedDataSync } from '../utils/apiCache';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, FolderTree } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState(() => getCachedDataSync(`${import.meta.env.VITE_BACKEND_URL || (`http://${window.location.hostname}:5000`)}/api/categories`) || null);
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  const { user } = useAuth();
  
  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const fetchCategories = async () => {
    try {
      const { data } = await cachedGet(`${import.meta.env.VITE_BACKEND_URL || (`http://${window.location.hostname}:5000`)}/api/categories`);
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const categoryData = { 
        name, slug: slug.toLowerCase(), parentCategory: parentCategory || null 
      };

      if (editId) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL || (`http://${window.location.hostname}:5000`)}/api/categories/${editId}`, categoryData, config);
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL || (`http://${window.location.hostname}:5000`)}/api/categories`, categoryData, config);
      }
      
      fetchCategories();
      resetForm();
    } catch (err) {
      Swal.fire(err.response?.data?.message || err.response?.data?.error || 'Error saving category');
    }
  };

  const handleDelete = async (id) => {
    if (!(await Swal.fire({title: 'Are you sure?', text: 'Are you sure you want to delete this category? Products using this category might lose their reference.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Yes'})).isConfirmed) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL || (`http://${window.location.hostname}:5000`)}/api/categories/${id}`, config);
      fetchCategories();
    } catch (err) {
      Swal.fire(err.response?.data?.message || 'Error deleting category');
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setName(cat.name);
    setSlug(cat.slug);
    setParentCategory(cat.parentCategory || '');
    setIsAdding(true);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditId(null);
    setName(''); setSlug(''); setParentCategory('');
  };

  const getParentName = (parentId) => {
    if (!parentId) return '-';
    const parent = categories.find(c => c._id === parentId);
    return parent ? parent.name : '-';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Categories Management</h2>
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
          {isAdding ? 'Cancel' : <><Plus size={18} /> Add Category</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-[#2a2a3c] p-6 rounded-xl border shadow-sm mb-6">
          <h3 className="font-bold text-lg mb-4">{editId ? 'Edit Category' : 'Create New Category / Subcategory'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category Name</label>
                <input required type="text" value={name} onChange={e=>{
                  setName(e.target.value);
                  if(!editId) setSlug(e.target.value.toLowerCase().replace(/ /g, '-'));
                }} className="w-full px-3 py-2 border rounded-md" placeholder="e.g. Smart Watches" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">URL Slug</label>
                <input required type="text" value={slug} onChange={e=>setSlug(e.target.value)} className="w-full px-3 py-2 border rounded-md lowercase" placeholder="e.g. smart-watches" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Parent Category (Optional - For Subcategories)</label>
                <select value={parentCategory} onChange={e=>setParentCategory(e.target.value)} className="w-full px-3 py-2 border rounded-md">
                  <option value="">None (Top Level Category)</option>
                  {(categories || []).map(c => {
                    // Prevent setting itself as parent
                    if (c._id === editId) return null;
                    return <option key={c._id} value={c._id}>{c.name}</option>;
                  })}
                </select>
              </div>
            </div>
            <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
              {editId ? 'Update Category' : 'Save Category'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-[#2a2a3c] rounded-xl border shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead className="bg-slate-50 dark:bg-[#1f1f2e] text-slate-700 dark:text-slate-300 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Slug</th>
              <th className="px-6 py-4 font-semibold">Parent Category</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories === null ? (
               [...Array(4)].map((_, i) => (
                 <tr key={i} className="animate-pulse hover:bg-slate-50 dark:bg-[#1f1f2e]">
                   <td className="px-6 py-4 flex items-center gap-2"><div className="w-4 h-4 bg-slate-200 dark:bg-[#3d3d5c] rounded"></div><div className="h-4 bg-slate-200 dark:bg-[#3d3d5c] rounded w-32"></div></td>
                   <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-[#3d3d5c] rounded w-24"></div></td>
                   <td className="px-6 py-4"><div className="h-6 bg-slate-200 dark:bg-[#3d3d5c] rounded-md w-28"></div></td>
                   <td className="px-6 py-4"><div className="h-8 bg-slate-200 dark:bg-[#3d3d5c] rounded w-20 ml-auto"></div></td>
                 </tr>
               ))
            ) : (categories || []).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(cat => (
              <tr key={cat._id} className="hover:bg-slate-50 dark:bg-[#1f1f2e] transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-50 flex items-center gap-2">
                  <FolderTree size={16} className="text-slate-400" />
                  {cat.name}
                </td>
                <td className="px-6 py-4 font-mono text-xs">{cat.slug}</td>
                <td className="px-6 py-4">
                  {cat.parentCategory ? (
                    <span className="bg-slate-100 dark:bg-[#2a2a3c]/50 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-md text-xs font-medium">
                      {getParentName(cat.parentCategory)}
                    </span>
                  ) : '-'}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(cat._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                return pages.map((p, idx) => p === '...' ? <span key={"elipsis" + idx} className="px-2 py-1 text-slate-400">...</span> : <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 rounded ${currentPage === p ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600"}`}>{p}</button>);
              })()}
              <button disabled={currentPage === Math.ceil(categories.length / itemsPerPage)} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 rounded bg-slate-100 text-slate-600 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
