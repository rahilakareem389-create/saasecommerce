import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, FolderTree } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  const { user } = useAuth();
  
  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentCategory, setParentCategory] = useState('');

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/categories`);
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
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/categories/${editId}`, categoryData, config);
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, categoryData, config);
      }
      
      fetchCategories();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Error saving category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? Products using this category might lose their reference.')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/categories/${id}`, config);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting category');
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
        <h2 className="text-xl font-bold text-slate-800">Categories Management</h2>
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
        <div className="bg-white p-6 rounded-xl border shadow-sm mb-6">
          <h3 className="font-bold text-lg mb-4">{editId ? 'Edit Category' : 'Create New Category / Subcategory'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Category Name</label>
                <input required type="text" value={name} onChange={e=>{
                  setName(e.target.value);
                  if(!editId) setSlug(e.target.value.toLowerCase().replace(/ /g, '-'));
                }} className="w-full px-3 py-2 border rounded-md" placeholder="e.g. Smart Watches" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">URL Slug</label>
                <input required type="text" value={slug} onChange={e=>setSlug(e.target.value)} className="w-full px-3 py-2 border rounded-md lowercase" placeholder="e.g. smart-watches" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Parent Category (Optional - For Subcategories)</label>
                <select value={parentCategory} onChange={e=>setParentCategory(e.target.value)} className="w-full px-3 py-2 border rounded-md">
                  <option value="">None (Top Level Category)</option>
                  {categories.map(c => {
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

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Slug</th>
              <th className="px-6 py-4 font-semibold">Parent Category</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map(cat => (
              <tr key={cat._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                  <FolderTree size={16} className="text-slate-400" />
                  {cat.name}
                </td>
                <td className="px-6 py-4 font-mono text-xs">{cat.slug}</td>
                <td className="px-6 py-4">
                  {cat.parentCategory ? (
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-medium">
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
      </div>
    </div>
  );
}
