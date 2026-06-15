import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
    PackageOpen, Plus, Pencil, Trash2, Search, X, Box, Tag, 
    FileText, IndianRupee, Layers, AlertCircle, CheckCircle2, 
    TrendingUp, Info, Activity
} from 'lucide-react';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    
    // Form States
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [imageBase64, setImageBase64] = useState('');
    const [editingId, setEditingId] = useState(null);
    
    // UI States
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get('/products'),
                api.get('/categories')
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!name.trim() || !categoryId) {
            toast.error('Please fill all required fields');
            return;
        }

        const payload = { name, quantity: parseInt(quantity), price: parseInt(price), description, categoryId, imageBase64 };
        const loadToast = toast.loading(editingId ? 'Updating product...' : 'Creating product...');
        
        try {
            if (editingId) {
                await api.put(`/products/${editingId}`, payload);
                toast.success('Product updated successfully!', { id: loadToast });
            } else {
                await api.post('/products', payload);
                toast.success('Product created successfully!', { id: loadToast });
            }
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error(error.response?.data || 'Failed to save product', { id: loadToast });
        }
    };

    const resetForm = () => {
        setName('');
        setQuantity('');
        setPrice('');
        setDescription('');
        setCategoryId('');
        setImageBase64('');
        setEditingId(null);
    };

    const handleEdit = (product) => {
        setName(product.name);
        setQuantity(product.quantity);
        setPrice(product.price);
        setDescription(product.description);
        setCategoryId(product.categoryId);
        setImageBase64(product.imageBase64 || '');
        setEditingId(product.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 300;
                const MAX_HEIGHT = 300;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                setImageBase64(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            const loadToast = toast.loading('Deleting product...');
            try {
                await api.delete(`/products/${id}`);
                toast.success('Product deleted successfully', { id: loadToast });
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('Failed to delete product', { id: loadToast });
            }
        }
    };

    const getCategoryName = (id) => {
        const cat = categories.find(c => c.id === id);
        return cat ? cat.name : 'Unknown';
    };

    // Filter products based on search and category
    const filteredProducts = useMemo(() => {
        return products.filter(prod => {
            const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                getCategoryName(prod.categoryId).toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = filterCategory === 'All' || prod.categoryId === filterCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, categories, filterCategory]);

    // Calculate Analytics
    const totalInventoryValue = products.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    const lowStockCount = products.filter(p => p.quantity > 0 && p.quantity <= 10).length;
    const outOfStockCount = products.filter(p => p.quantity === 0).length;

    return (
        <div className="max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg">
                            <Box size={28} />
                        </div>
                        Product Inventory
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 ml-14">
                        Add, monitor, and update your product catalog efficiently
                    </p>
                </div>

                {/* Inventory Tips - Moved to Header Right */}
                <div className="bg-indigo-50/80 border border-indigo-100 p-3.5 rounded-2xl hidden lg:flex items-center gap-3 max-w-md shadow-sm">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full shrink-0">
                        <Info size={20} />
                    </div>
                    <div className="text-sm text-indigo-800">
                        <p className="font-bold mb-0.5 text-indigo-900 leading-tight">Inventory Tips</p>
                        <p className="text-xs leading-snug">
                            Set prices carefully for healthy margins. Watch your <span className="font-bold text-amber-600">low stock</span> alerts to restock early!
                        </p>
                    </div>
                </div>
            </div>

            {/* Product Insights Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden">
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl relative z-10">
                        <PackageOpen size={28} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Products</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-1">{products.length}</h3>
                    </div>
                    <Activity className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-indigo-50 opacity-50" />
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden">
                    <div className="p-4 bg-green-50 text-green-600 rounded-2xl relative z-10">
                        <TrendingUp size={28} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Inventory Value</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-1">₹{totalInventoryValue.toLocaleString()}</h3>
                    </div>
                    <IndianRupee className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-green-50 opacity-50" />
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-3xl shadow-sm border border-amber-100 flex items-center gap-4 relative overflow-hidden">
                    <div className="p-4 bg-white text-amber-500 rounded-2xl shadow-sm relative z-10">
                        <AlertCircle size={28} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-bold text-amber-800 uppercase tracking-wider">Stock Alerts</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-2xl font-black text-amber-600">{lowStockCount} <span className="text-sm font-bold opacity-80">low</span></span>
                            <span className="text-gray-300">|</span>
                            <span className="text-2xl font-black text-red-600">{outOfStockCount} <span className="text-sm font-bold opacity-80">empty</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Left Column: Form */}
                <div className="xl:col-span-1 sticky top-24 self-start space-y-6">
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4 border-b pb-3">
                            <div className={`p-2 rounded-xl text-white shadow-md ${editingId ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
                                {editingId ? <Pencil size={20} /> : <Plus size={20} />}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingId ? 'Edit Product' : 'Add Product'}
                            </h3>
                        </div>

                        <form onSubmit={handleSave} className="space-y-3">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-1 flex items-center gap-1.5">
                                    <Tag size={16} className="text-indigo-500" /> Product Name
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-800 shadow-inner" 
                                    placeholder="e.g. Wireless Mouse"
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-1 flex items-center gap-1.5">
                                    <Layers size={16} className="text-indigo-500" /> Category
                                </label>
                                <select 
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-800 shadow-inner" 
                                    value={categoryId} 
                                    onChange={(e) => setCategoryId(e.target.value)} 
                                    required
                                >
                                    <option value="" disabled>Select a Category...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-1 flex items-center gap-1.5">
                                        <Box size={16} className="text-indigo-500" /> Quantity
                                    </label>
                                    <input 
                                        type="number" 
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-800 shadow-inner" 
                                        placeholder="0"
                                        value={quantity} 
                                        onChange={(e) => setQuantity(e.target.value)} 
                                        required 
                                        min="0" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-1 flex items-center gap-1.5">
                                        <IndianRupee size={16} className="text-indigo-500" /> Price
                                    </label>
                                    <input 
                                        type="number" 
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-800 shadow-inner" 
                                        placeholder="0.00"
                                        value={price} 
                                        onChange={(e) => setPrice(e.target.value)} 
                                        required 
                                        min="0" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-1 flex items-center gap-1.5">
                                    <FileText size={16} className="text-indigo-500" /> Description
                                </label>
                                <textarea 
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-800 shadow-inner" 
                                    placeholder="Enter product details..."
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)} 
                                    required 
                                    rows="2"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-1 flex items-center gap-1.5">
                                    <AlertCircle size={16} className="text-indigo-500" /> Product Image (Optional)
                                </label>
                                <div className="flex items-center gap-4 mt-2">
                                    {imageBase64 && (
                                        <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 border-indigo-100 shadow-sm relative group">
                                            <img src={imageBase64} alt="Preview" className="w-full h-full object-cover" />
                                            <button 
                                                type="button" 
                                                onClick={() => setImageBase64('')}
                                                className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors cursor-pointer"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-3 pt-3 border-t border-gray-100">
                                <button 
                                    type="submit" 
                                    className={`flex-1 flex items-center justify-center gap-2 text-white px-4 py-2.5 rounded-xl font-bold transition duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5
                                        ${editingId ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-indigo-600 to-purple-600'}
                                    `}
                                >
                                    {editingId ? <Pencil size={18} /> : <Plus size={18} />}
                                    {editingId ? 'Update Product' : 'Save Product'}
                                </button>
                                
                                {editingId && (
                                    <button 
                                        type="button" 
                                        onClick={resetForm} 
                                        className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition duration-200"
                                        title="Cancel Edit"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: List */}
                <div className="xl:col-span-2 sticky top-24 self-start">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col max-h-[calc(100vh-10rem)] min-h-[500px]">
                        
                        {/* List Header with Search */}
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <PackageOpen size={22} className="text-gray-500" />
                                Catalog 
                            </h3>
                            
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <select 
                                    className="w-full sm:w-48 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-700 shadow-sm"
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                >
                                    <option value="All">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                
                                <div className="relative w-full sm:w-64">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* List Body */}
                        <div className="overflow-y-auto flex-1 p-0">
                            {isLoading ? (
                                <div className="p-16 text-center text-gray-500 h-full flex flex-col items-center justify-center">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                                    Loading inventory...
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="p-16 text-center h-full flex flex-col items-center justify-center">
                                    <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                                        <PackageOpen size={40} className="text-gray-400" />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">No products found</h4>
                                    <p className="text-gray-500 max-w-sm mx-auto">
                                        {(searchQuery || filterCategory !== 'All') 
                                            ? "We couldn't find any products matching your filters." 
                                            : "Your catalog is empty. Create your first product to get started!"}
                                    </p>
                                    {(searchQuery || filterCategory !== 'All') && (
                                        <button 
                                            onClick={() => { setSearchQuery(''); setFilterCategory('All'); }}
                                            className="mt-6 text-indigo-600 hover:text-indigo-800 text-sm font-bold bg-indigo-50 px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Clear filters
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
                                        <tr className="text-gray-500 text-xs uppercase tracking-wider font-bold border-b border-gray-200">
                                            <th className="py-4 px-6 w-16">ID</th>
                                            <th className="py-4 px-6">Product Details</th>
                                            <th className="py-4 px-6 text-center">Status</th>
                                            <th className="py-4 px-6 text-right">Price</th>
                                            <th className="py-4 px-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredProducts.map((prod, index) => (
                                            <tr key={prod.id} className="hover:bg-indigo-50/40 transition-colors group">
                                                <td className="py-4 px-6 text-sm text-gray-500 font-bold">
                                                    #{index + 1}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        {prod.imageBase64 ? (
                                                            <img src={prod.imageBase64} alt={prod.name} className="w-10 h-10 rounded-lg object-cover shadow-sm border border-gray-200 shrink-0" />
                                                        ) : (
                                                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold shadow-sm shrink-0">
                                                                {prod.name ? prod.name.charAt(0).toUpperCase() : 'P'}
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-gray-900 text-base">{prod.name}</span>
                                                            <span className="text-xs text-indigo-500 font-bold mt-0.5 tracking-wide uppercase">{getCategoryName(prod.categoryId)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    {prod.quantity > 10 ? (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-full shadow-sm">
                                                            <CheckCircle2 size={14} className="text-green-500" />
                                                            {prod.quantity} In Stock
                                                        </div>
                                                    ) : prod.quantity > 0 ? (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-full shadow-sm">
                                                            <AlertCircle size={14} className="text-amber-500" />
                                                            {prod.quantity} Low Stock
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-full shadow-sm">
                                                            <X size={14} className="text-red-500" />
                                                            Out of Stock
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <span className="font-black text-gray-900 text-base tracking-tight">₹{prod.price.toLocaleString()}</span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => handleEdit(prod)} 
                                                            className="p-2 text-indigo-600 bg-white border border-indigo-100 hover:bg-indigo-50 hover:border-indigo-300 rounded-xl transition-all shadow-sm"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(prod.id)} 
                                                            className="p-2 text-red-600 bg-white border border-red-100 hover:bg-red-50 hover:border-red-300 rounded-xl transition-all shadow-sm"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        
                        {/* Footer stats */}
                        {!isLoading && filteredProducts.length > 0 && (
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 shrink-0">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Displaying {filteredProducts.length} items
                                </span>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ManageProducts;
