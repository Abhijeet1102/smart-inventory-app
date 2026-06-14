import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
    Users, UserPlus, Pencil, Trash2, Search, X, Mail, Phone, 
    User, Info, Contact, AtSign 
} from 'lucide-react';

const ManageCustomers = () => {
    const [customers, setCustomers] = useState([]);
    
    // Form States
    const [name, setName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [editingId, setEditingId] = useState(null);

    // UI States
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/customers');
            setCustomers(res.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast.error('Failed to load customers');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!name.trim()) {
            toast.error('Please provide a customer name');
            return;
        }

        const payload = { name, mobileNumber, email };
        const loadToast = toast.loading(editingId ? 'Updating customer...' : 'Adding customer...');
        
        try {
            if (editingId) {
                await api.put(`/customers/${editingId}`, payload);
                toast.success('Customer updated successfully!', { id: loadToast });
            } else {
                await api.post('/customers', payload);
                toast.success('Customer added successfully!', { id: loadToast });
            }
            resetForm();
            fetchCustomers();
        } catch (error) {
            console.error('Error saving customer:', error);
            toast.error(error.response?.data || 'Failed to save customer', { id: loadToast });
        }
    };

    const resetForm = () => {
        setName('');
        setMobileNumber('');
        setEmail('');
        setEditingId(null);
    };

    const handleEdit = (customer) => {
        setName(customer.name);
        setMobileNumber(customer.mobileNumber);
        setEmail(customer.email);
        setEditingId(customer.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
            const loadToast = toast.loading('Deleting customer...');
            try {
                await api.delete(`/customers/${id}`);
                toast.success('Customer deleted successfully', { id: loadToast });
                fetchCustomers();
            } catch (error) {
                console.error('Error deleting customer:', error);
                toast.error('Failed to delete customer', { id: loadToast });
            }
        }
    };

    // Filter customers based on search
    const filteredCustomers = useMemo(() => {
        if (!searchQuery) return customers;
        const lowerQuery = searchQuery.toLowerCase();
        return customers.filter(cust => 
            cust.name.toLowerCase().includes(lowerQuery) || 
            (cust.email && cust.email.toLowerCase().includes(lowerQuery)) ||
            (cust.mobileNumber && cust.mobileNumber.toLowerCase().includes(lowerQuery))
        );
    }, [customers, searchQuery]);

    // Calculate Analytics
    const totalCustomers = customers.length;
    const customersWithContact = customers.filter(c => c.email || c.mobileNumber).length;
    const contactRate = totalCustomers > 0 ? Math.round((customersWithContact / totalCustomers) * 100) : 0;
    const customersWithEmail = customers.filter(c => c.email).length;

    return (
        <div className="max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg">
                            <Users size={28} />
                        </div>
                        Manage Customers
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 ml-14">
                        Grow and manage your customer database efficiently
                    </p>
                </div>

                {/* Customer Tips - Header Right */}
                <div className="bg-emerald-50/80 border border-emerald-100 p-3.5 rounded-2xl hidden lg:flex items-center gap-3 max-w-md shadow-sm">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full shrink-0">
                        <Info size={20} />
                    </div>
                    <div className="text-sm text-emerald-800">
                        <p className="font-bold mb-0.5 text-emerald-900 leading-tight">Customer Tips</p>
                        <p className="text-xs leading-snug">
                            Always capture an email or phone number! This helps in sending <span className="font-bold text-teal-700">promotions</span> and building loyalty.
                        </p>
                    </div>
                </div>
            </div>

            {/* Customer Insights Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl relative z-10">
                        <Users size={28} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Customers</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-1">{totalCustomers}</h3>
                    </div>
                    <Users className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-emerald-50 opacity-50" />
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden">
                    <div className="p-4 bg-teal-50 text-teal-600 rounded-2xl relative z-10">
                        <Contact size={28} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Contact Rate</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-1">{contactRate}%</h3>
                    </div>
                    <Contact className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-teal-50 opacity-50" />
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden">
                    <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl relative z-10">
                        <AtSign size={28} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Email Subscribers</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-1">{customersWithEmail}</h3>
                    </div>
                    <AtSign className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-blue-50 opacity-50" />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Left Column: Form */}
                <div className="xl:col-span-1 sticky top-24 self-start space-y-6">
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4 border-b pb-3">
                            <div className={`p-2 rounded-xl text-white shadow-md ${editingId ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-emerald-500 to-teal-600'}`}>
                                {editingId ? <Pencil size={20} /> : <UserPlus size={20} />}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingId ? 'Edit Customer' : 'Add Customer'}
                            </h3>
                        </div>

                        <form onSubmit={handleSave} className="space-y-3">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-1 flex items-center gap-1.5">
                                    <User size={16} className="text-emerald-500" /> Full Name
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-gray-800 shadow-inner" 
                                    placeholder="e.g. John Doe"
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-1 flex items-center gap-1.5">
                                    <Phone size={16} className="text-emerald-500" /> Mobile Number <span className="text-xs font-normal text-gray-400 ml-1">(Optional)</span>
                                </label>
                                <input 
                                    type="tel" 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-gray-800 shadow-inner" 
                                    placeholder="+1 234 567 8900"
                                    value={mobileNumber} 
                                    onChange={(e) => setMobileNumber(e.target.value)} 
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-1 flex items-center gap-1.5">
                                    <Mail size={16} className="text-emerald-500" /> Email Address <span className="text-xs font-normal text-gray-400 ml-1">(Optional)</span>
                                </label>
                                <input 
                                    type="email" 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-gray-800 shadow-inner" 
                                    placeholder="john@example.com"
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </div>
                            
                            <div className="flex gap-3 pt-3 border-t border-gray-100">
                                <button 
                                    type="submit" 
                                    className={`flex-1 flex items-center justify-center gap-2 text-white px-4 py-2.5 rounded-xl font-bold transition duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5
                                        ${editingId ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-emerald-600 to-teal-600'}
                                    `}
                                >
                                    {editingId ? <Pencil size={18} /> : <UserPlus size={18} />}
                                    {editingId ? 'Update Customer' : 'Save Customer'}
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
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        
                        {/* List Header with Search */}
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Users size={22} className="text-gray-500" />
                                Customer List 
                            </h3>
                            
                            <div className="relative w-full sm:w-72">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search name, email or phone..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* List Body with Scrolling */}
                        <div className="overflow-y-auto p-0 max-h-[280px]">
                            {isLoading ? (
                                <div className="p-16 text-center text-gray-500 h-full flex flex-col items-center justify-center">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-emerald-600 mx-auto mb-4"></div>
                                    Loading customers...
                                </div>
                            ) : filteredCustomers.length === 0 ? (
                                <div className="p-16 text-center h-full flex flex-col items-center justify-center">
                                    <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                                        <Users size={40} className="text-gray-400" />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">No customers found</h4>
                                    <p className="text-gray-500 max-w-sm mx-auto">
                                        {searchQuery 
                                            ? `We couldn't find any customers matching "${searchQuery}".` 
                                            : "Your customer database is empty. Add your first customer!"}
                                    </p>
                                    {searchQuery && (
                                        <button 
                                            onClick={() => setSearchQuery('')}
                                            className="mt-6 text-emerald-600 hover:text-emerald-800 text-sm font-bold bg-emerald-50 px-4 py-2 rounded-lg transition-colors"
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
                                            <th className="py-4 px-6">Customer Details</th>
                                            <th className="py-4 px-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredCustomers.map((cust, index) => (
                                            <tr key={cust.id} className="hover:bg-emerald-50/40 transition-colors group">
                                                <td className="py-4 px-6 text-sm text-gray-500 font-bold">
                                                    #{index + 1}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-900 text-base">{cust.name}</span>
                                                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs font-medium text-gray-500">
                                                            {cust.email ? (
                                                                <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100"><Mail size={12}/> {cust.email}</span>
                                                            ) : (
                                                                <span className="text-gray-400 italic text-[10px]">No Email</span>
                                                            )}
                                                            
                                                            {cust.mobileNumber ? (
                                                                <span className="flex items-center gap-1.5 text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100"><Phone size={12}/> {cust.mobileNumber}</span>
                                                            ) : (
                                                                <span className="text-gray-400 italic text-[10px]">No Phone</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => handleEdit(cust)} 
                                                            className="p-2 text-emerald-600 bg-white border border-emerald-100 hover:bg-emerald-50 hover:border-emerald-300 rounded-xl transition-all shadow-sm"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(cust.id)} 
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
                        {!isLoading && filteredCustomers.length > 0 && (
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 shrink-0">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Displaying {filteredCustomers.length} entries
                                </span>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ManageCustomers;
