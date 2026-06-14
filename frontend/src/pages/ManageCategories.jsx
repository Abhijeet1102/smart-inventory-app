import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Package, Plus, Pencil, Trash2, Search, X, Layers, Tag, Sparkles } from 'lucide-react';

const ALL_PREDEFINED_CATEGORIES = [
    'Electronics', 'Groceries', 'Clothing', 'Furniture', 
    'Books', 'Toys', 'Home Appliances', 'Automotive', 
    'Beauty & Care', 'Sports', 'Stationery', 'Hardware',
    'Kitchenware', 'Pet Supplies', 'Health & Wellness',
    'Jewelry', 'Footwear', 'Musical Instruments',
    'Baby Products', 'Office Supplies', 'Gardening',
    'Arts & Crafts', 'Video Games', 'Outdoors', 'Fitness'
];

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        
        if (!name.trim()) {
            toast.error('Category name cannot be empty');
            return;
        }

        // Check for duplicates
        const isDuplicate = categories.some(cat => cat.name.toLowerCase() === name.trim().toLowerCase() && cat.id !== editingId);
        if (isDuplicate) {
            toast.error('This category already exists!');
            return;
        }

        const loadToast = toast.loading(editingId ? 'Updating category...' : 'Creating category...');
        
        try {
            if (editingId) {
                await api.put(`/categories/${editingId}`, { name: name.trim() });
                toast.success('Category updated successfully!', { id: loadToast });
            } else {
                await api.post('/categories', { name: name.trim() });
                toast.success('Category created successfully!', { id: loadToast });
            }
            setName('');
            setEditingId(null);
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error(error.response?.data || 'Failed to save category', { id: loadToast });
        }
    };

    const handleQuickAdd = async (presetName) => {
        const loadToast = toast.loading(`Adding ${presetName}...`);
        try {
            await api.post('/categories', { name: presetName });
            toast.success(`${presetName} added successfully!`, { id: loadToast });
            fetchCategories();
        } catch (error) {
            console.error('Error auto-saving category:', error);
            toast.error(error.response?.data || `Failed to add ${presetName}`, { id: loadToast });
        }
    };

    const handleEdit = (category) => {
        setName(category.name);
        setEditingId(category.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            const loadToast = toast.loading('Deleting category...');
            try {
                await api.delete(`/categories/${id}`);
                toast.success('Category deleted successfully', { id: loadToast });
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                toast.error('Failed to delete category', { id: loadToast });
            }
        }
    };

    const handleCancelEdit = () => {
        setName('');
        setEditingId(null);
    };

    const filteredCategories = useMemo(() => {
        if (!searchQuery) return categories;
        return categories.filter(cat => 
            cat.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [categories, searchQuery]);

    const suggestedCategories = useMemo(() => {
        const existingNames = new Set(categories.map(c => c.name.toLowerCase()));
        const available = ALL_PREDEFINED_CATEGORIES.filter(preset => !existingNames.has(preset.toLowerCase()));
        return available.slice(0, 12);
    }, [categories]);

    return (
        <div className="max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg">
                            <Layers size={28} />
                        </div>
                        Product Categories
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 ml-14">
                        Organize your products into logical collections to make them easier to find
                    </p>
                </div>
            </div>

            {/* Top Full-Width Section: Quick Add Presets */}
            {!editingId && suggestedCategories.length > 0 && (
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-3xl shadow-sm border border-blue-100 relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-4 relative z-10">
                        <Sparkles size={20} className="text-blue-600" />
                        <h3 className="text-lg font-bold text-blue-900">Popular Suggestions</h3>
                    </div>
                    <p className="text-sm text-blue-700/80 mb-5 relative z-10">
                        Select from these commonly used retail categories to instantly add them to your system.
                    </p>
                    
                    <div className="flex flex-wrap gap-3 relative z-10">
                        {suggestedCategories.map((preset) => (
                            <button
                                key={preset}
                                onClick={() => handleQuickAdd(preset)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-700 text-sm font-bold rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md hover:-translate-y-0.5 transition-all shadow-sm"
                            >
                                <Plus size={14} /> {preset}
                            </button>
                        ))}
                    </div>
                    
                    <div className="absolute right-[-20px] top-[-20px] opacity-[0.03] pointer-events-none">
                        <Layers size={200} />
                    </div>
                </div>
            )}

            {/* Main Content Area: Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Left Column: Form */}
                <div className="xl:col-span-1 sticky top-6 self-start space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-6 border-b pb-4">
                            <div className={`p-2 rounded-xl ${editingId ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                {editingId ? <Pencil size={20} /> : <Plus size={20} />}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingId ? 'Edit Details' : 'Add Category'}
                            </h3>
                        </div>

                        <form onSubmit={handleSave} className="space-y-5">
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Category Name</label>
                                <input 
                                    id="category-input"
                                    type="text" 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner" 
                                    placeholder="Enter category name"
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                />
                            </div>
                            
                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="submit" 
                                    className={`flex-1 flex items-center justify-center gap-2 text-white px-4 py-3 rounded-xl font-bold transition duration-200 shadow-md hover:shadow-lg
                                        ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}
                                    `}
                                >
                                    {editingId ? <Pencil size={18} /> : <Plus size={18} />}
                                    {editingId ? 'Save Changes' : 'Create Category'}
                                </button>
                                
                                {editingId && (
                                    <button 
                                        type="button" 
                                        onClick={handleCancelEdit} 
                                        className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition duration-200 shadow-sm"
                                        title="Cancel Edit"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Best Practices Card */}
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-3xl shadow-sm border border-indigo-100">
                        <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                            💡 Naming Best Practices
                        </h4>
                        <ul className="text-sm text-indigo-700/80 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-500 font-bold mt-0.5">✓</span> Keep names concise (1-2 words).
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-500 font-bold mt-0.5">✓</span> Use plural forms (e.g., "Electronics", not "Electronic").
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-500 font-bold mt-0.5">✓</span> Avoid overly specific categories that overlap.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Column: Scrolling List */}
                <div className="xl:col-span-2 sticky top-6 self-start">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col max-h-[calc(100vh-10rem)] min-h-[400px]">
                        
                        {/* List Header with Search */}
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Package size={22} className="text-gray-500" />
                                All Categories 
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold py-1 px-3 rounded-full ml-2">
                                    {categories.length} total
                                </span>
                            </h3>
                            
                            <div className="relative w-full sm:w-72">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* List Body with Scrolling */}
                        <div className="overflow-y-auto flex-1 p-0 min-h-[400px]">
                            {isLoading ? (
                                <div className="p-16 text-center text-gray-500 h-full flex flex-col items-center justify-center">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                                    Loading categories...
                                </div>
                            ) : filteredCategories.length === 0 ? (
                                <div className="p-16 text-center h-full flex flex-col items-center justify-center">
                                    <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                                        <Package size={40} className="text-gray-400" />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">No categories found</h4>
                                    <p className="text-gray-500 max-w-sm mx-auto">
                                        {searchQuery 
                                            ? `No matches found for "${searchQuery}".` 
                                            : "Your catalog is empty. Add a category to begin!"}
                                    </p>
                                    {searchQuery && (
                                        <button 
                                            onClick={() => setSearchQuery('')}
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
                                            <th className="py-4 px-6 w-24">ID</th>
                                            <th className="py-4 px-6">Name</th>
                                            <th className="py-4 px-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredCategories.map((cat, index) => (
                                            <tr key={cat.id} className="hover:bg-indigo-50/40 transition-colors group">
                                                <td className="py-4 px-6 text-sm text-gray-500 font-medium">
                                                    {index + 1}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="inline-flex items-center gap-2 font-bold text-gray-900 bg-white border border-gray-200 shadow-sm px-3 py-1.5 rounded-lg">
                                                        <Tag size={14} className="text-indigo-500" />
                                                        {cat.name}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => handleEdit(cat)} 
                                                            className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 rounded-xl transition-colors shadow-sm"
                                                            title="Edit Category"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(cat.id)} 
                                                            className="p-2 text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-xl transition-colors shadow-sm"
                                                            title="Delete Category"
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
                        {!isLoading && filteredCategories.length > 0 && (
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 text-xs font-medium text-gray-500 text-center sm:text-left shrink-0">
                                Showing {filteredCategories.length} categories.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ManageCategories;
