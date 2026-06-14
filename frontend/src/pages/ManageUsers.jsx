import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { UserCog, Shield, Pencil, Trash2, Search, X, Mail, Phone, MapPin, Key, UserPlus } from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    
    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [userRole, setUserRole] = useState('Admin');
    const [status, setStatus] = useState('Active');
    const [editingId, setEditingId] = useState(null);

    // UI States
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load system users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!name.trim() || !email.trim() || !mobileNumber.trim()) {
            toast.error('Please fill all required fields');
            return;
        }

        const payload = { name, email, mobileNumber, address, password, userRole, status };
        const loadToast = toast.loading(editingId ? 'Updating user...' : 'Creating user account...');
        
        try {
            if (editingId) {
                await api.put(`/users/${editingId}`, payload);
                toast.success('User updated successfully!', { id: loadToast });
            } else {
                await api.post('/users', payload);
                toast.success('User created successfully!', { id: loadToast });
            }
            resetForm();
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error(error.response?.data || 'Failed to save user', { id: loadToast });
        }
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setMobileNumber('');
        setAddress('');
        setPassword('');
        setUserRole('Admin');
        setStatus('Active');
        setEditingId(null);
    };

    const handleEdit = (user) => {
        setName(user.name);
        setEmail(user.email);
        setMobileNumber(user.mobileNumber);
        setAddress(user.address);
        setUserRole(user.userRole);
        setStatus(user.status);
        setEditingId(user.id);
        // Do not set password for security reasons, leave blank unless changing
        setPassword(''); 
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user account? This action cannot be undone.')) {
            const loadToast = toast.loading('Deleting user account...');
            try {
                await api.delete(`/users/${id}`);
                toast.success('User deleted successfully', { id: loadToast });
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Failed to delete user', { id: loadToast });
            }
        }
    };

    // Filter users based on search
    const filteredUsers = useMemo(() => {
        if (!searchQuery) return users;
        const lowerQuery = searchQuery.toLowerCase();
        return users.filter(u => 
            u.name.toLowerCase().includes(lowerQuery) || 
            u.email.toLowerCase().includes(lowerQuery) ||
            u.userRole.toLowerCase().includes(lowerQuery)
        );
    }, [users, searchQuery]);

    return (
        <div className="max-w-7xl mx-auto pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
                            <UserCog size={28} />
                        </div>
                        Manage System Users
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 ml-14">
                        Add, edit, and control access permissions for administrators
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Left Column: Form */}
                <div className="xl:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
                        <div className="flex items-center gap-2 mb-6 border-b pb-4">
                            <div className={`p-1.5 rounded-md ${editingId ? 'bg-amber-100 text-amber-600' : 'bg-teal-100 text-teal-600'}`}>
                                {editingId ? <Pencil size={18} /> : <UserPlus size={18} />}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">
                                {editingId ? 'Edit User Details' : 'Create New User'}
                            </h3>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-1 flex items-center gap-1">
                                    <UserCog size={14} className="text-gray-400" /> Full Name
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" 
                                    placeholder="e.g. Alice Smith"
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-gray-700 text-sm font-semibold mb-1 flex items-center gap-1">
                                        <Mail size={14} className="text-gray-400" /> Email
                                    </label>
                                    <input 
                                        type="email" 
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" 
                                        placeholder="alice@company.com"
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-gray-700 text-sm font-semibold mb-1 flex items-center gap-1">
                                        <Phone size={14} className="text-gray-400" /> Mobile Number
                                    </label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" 
                                        placeholder="+1 234 567 890"
                                        value={mobileNumber} 
                                        onChange={(e) => setMobileNumber(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-1 flex items-center gap-1">
                                    <MapPin size={14} className="text-gray-400" /> Address
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" 
                                    placeholder="City, State"
                                    value={address} 
                                    onChange={(e) => setAddress(e.target.value)} 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 mt-2">
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1 flex items-center gap-1">
                                        <Shield size={14} className="text-gray-400" /> Role
                                    </label>
                                    <select 
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" 
                                        value={userRole} 
                                        onChange={(e) => setUserRole(e.target.value)}
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="SuperAdmin">Super Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Account Status</label>
                                    <select 
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" 
                                        value={status} 
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="block text-gray-700 text-sm font-semibold mb-1 flex items-center justify-between">
                                    <span className="flex items-center gap-1"><Key size={14} className="text-gray-400" /> Password</span>
                                    {editingId && <span className="text-xs text-amber-500 font-normal">Leave blank to keep current</span>}
                                </label>
                                <input 
                                    type="password" 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" 
                                    placeholder={editingId ? "••••••••" : "Create secure password"}
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required={!editingId} 
                                />
                            </div>
                            
                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button 
                                    type="submit" 
                                    className={`flex-1 flex items-center justify-center gap-2 text-white px-4 py-2.5 rounded-xl font-medium transition duration-200 shadow-sm
                                        ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-teal-600 hover:bg-teal-700'}
                                    `}
                                >
                                    {editingId ? <Pencil size={18} /> : <UserPlus size={18} />}
                                    {editingId ? 'Update User' : 'Create User'}
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
                <div className="xl:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        
                        {/* List Header with Search */}
                        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Shield size={20} className="text-gray-500" />
                                Active Personnel
                                <span className="bg-teal-100 text-teal-700 text-xs py-1 px-2.5 rounded-full ml-2">
                                    {users.length} total
                                </span>
                            </h3>
                            
                            <div className="relative w-full sm:w-72">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={16} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* List Body */}
                        <div className="overflow-x-auto">
                            {isLoading ? (
                                <div className="p-12 text-center text-gray-500">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
                                    Loading system users...
                                </div>
                            ) : filteredUsers.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <UserCog size={32} className="text-gray-400" />
                                    </div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-1">No users found</h4>
                                    <p className="text-gray-500 text-sm max-w-sm mx-auto">
                                        {searchQuery 
                                            ? `We couldn't find any users matching "${searchQuery}".` 
                                            : "The system has no additional users."}
                                    </p>
                                    {searchQuery && (
                                        <button 
                                            onClick={() => setSearchQuery('')}
                                            className="mt-4 text-teal-600 hover:text-teal-800 text-sm font-medium"
                                        >
                                            Clear search filter
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead>
                                        <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
                                            <th className="py-4 px-6">ID</th>
                                            <th className="py-4 px-6">User Details</th>
                                            <th className="py-4 px-6 text-center">Role</th>
                                            <th className="py-4 px-6 text-center">Status</th>
                                            <th className="py-4 px-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredUsers.map((u, index) => (
                                            <tr key={u.id} className="hover:bg-teal-50/30 transition-colors group">
                                                <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                                                    {index + 1}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
                                                            ${u.userRole === 'SuperAdmin' ? 'bg-amber-500' : 'bg-teal-500'}
                                                        `}>
                                                            {u.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-gray-900">{u.name}</span>
                                                            <span className="text-xs text-gray-500 mt-0.5">{u.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md flex items-center justify-center w-fit mx-auto gap-1
                                                        ${u.userRole === 'SuperAdmin' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}
                                                    `}>
                                                        {u.userRole === 'SuperAdmin' && <Shield size={10} />}
                                                        {u.userRole}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full inline-block
                                                        ${u.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}
                                                    `}>
                                                        {u.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => handleEdit(u)} 
                                                            className="p-2 text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(u.id)} 
                                                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
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
                        {!isLoading && filteredUsers.length > 0 && (
                            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                                <span>Showing {filteredUsers.length} system users.</span>
                                <span>Super Admins: {filteredUsers.filter(u => u.userRole === 'SuperAdmin').length}</span>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ManageUsers;
