const fs = require('fs');
let data = fs.readFileSync('frontend/src/pages/AdminProducts.jsx', 'utf8');

// The user wants ALL categories to show in the dropdown.
data = data.replace(
  "const mainCategories = (categories || []).filter(c => !c.parentCategory);",
  "const mainCategories = (categories || []); // Show ALL categories"
);

// We will also add a prompt to create a new Category right from the UI
const createCatCode = `
  const handleCreateCategory = async (isSub = false) => {
    const { value: catName } = await Swal.fire({
      title: isSub ? 'New Subcategory' : 'New Category',
      input: 'text',
      inputPlaceholder: 'Enter name...',
      showCancelButton: true
    });
    if(catName) {
      try {
        const config = { headers: { Authorization: \`Bearer \${user.token}\` } };
        const payload = { name: catName, description: '', isActive: true };
        if(isSub && category) payload.parentCategory = category;
        const res = await axios.post(\`\${import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app"}/api/categories\`, payload, config);
        setCategories([...categories, res.data]);
        if(isSub) setSubCategory(res.data._id);
        else setCategory(res.data._id);
        Swal.fire('Created', '', 'success');
      } catch(e) {
        Swal.fire('Error', 'Could not create category', 'error');
      }
    }
  };
`;

data = data.replace("  const mainCategories =", createCatCode + "\n  const mainCategories =");

// Now update the UI to add the [+] button
const uiRegex1 = /<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category<\/label>/;
data = data.replace(uiRegex1, `<div className="flex justify-between items-center"><label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label><button type="button" onClick={() => handleCreateCategory(false)} className="text-xs text-primary-600 hover:underline font-bold">+ New</button></div>`);

const uiRegex2 = /<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Subcategory<\/label>/;
data = data.replace(uiRegex2, `<div className="flex justify-between items-center"><label className="text-sm font-medium text-slate-700 dark:text-slate-300">Subcategory</label><button type="button" onClick={() => handleCreateCategory(true)} disabled={!category} className="text-xs text-primary-600 hover:underline font-bold disabled:opacity-50">+ New</button></div>`);

fs.writeFileSync('frontend/src/pages/AdminProducts.jsx', data);
console.log("Success");
