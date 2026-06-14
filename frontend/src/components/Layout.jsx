import React from 'react';
import { Link, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { User, LogOut, Mail, Phone, Shield, ChevronDown, Package, Settings, CreditCard } from 'lucide-react';

const Layout = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user.id) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg border-r border-gray-100 flex flex-col z-10">
                <div className="p-6 border-b border-gray-50">
                    <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-2">
                        <Package size={28} className="text-blue-600" />
                        Inventory
                    </h1>
                </div>
                <nav className="mt-6">
                    <Link to="/" className="block py-3 px-6 text-gray-600 hover:bg-blue-50 hover:text-blue-600">Dashboard</Link>
                    {user.userRole === 'SuperAdmin' && (
                        <Link to="/users" className="block py-3 px-6 text-gray-600 hover:bg-blue-50 hover:text-blue-600">Manage Users</Link>
                    )}
                    <Link to="/categories" className="block py-3 px-6 text-gray-600 hover:bg-blue-50 hover:text-blue-600">Manage Categories</Link>
                    <Link to="/products" className="block py-3 px-6 text-gray-600 hover:bg-blue-50 hover:text-blue-600">Manage Products</Link>
                    <Link to="/customers" className="block py-3 px-6 text-gray-600 hover:bg-blue-50 hover:text-blue-600">Manage Customers</Link>
                    <Link to="/orders" className="block py-3 px-6 text-gray-600 hover:bg-blue-50 hover:text-blue-600">Manage Orders</Link>
                    <Link to="/view-orders" className="block py-3 px-6 text-gray-600 hover:bg-blue-50 hover:text-blue-600">View Orders</Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="bg-white shadow-sm border-b border-gray-100 z-20">
                    <div className="px-6 py-3 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">Welcome Back!</h2>
                        
                        {/* Profile Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-xl transition-colors border border-transparent hover:border-gray-200">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                    <p className="text-xs font-semibold text-blue-600">{user.userRole}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black shadow-md border-2 border-white">
                                    {(user.name || 'U').charAt(0).toUpperCase()}
                                </div>
                                <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600 transition-transform group-hover:rotate-180" />
                            </button>
                            
                            {/* Invisible bridge to keep hover active */}
                            <div className="absolute top-full right-0 h-4 w-full"></div>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                                {/* Header */}
                                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-100 rounded-t-3xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg border-4 border-white">
                                            {(user.name || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 text-lg leading-tight">{user.name}</p>
                                            <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 bg-white text-blue-700 text-xs font-bold rounded-md shadow-sm border border-blue-100">
                                                <Shield size={12} /> {user.userRole}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="p-3">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition-colors">
                                            <Mail size={16} className="text-gray-400" /> 
                                            <span className="truncate">{user.email || 'No email provided'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition-colors">
                                            <Phone size={16} className="text-gray-400" /> 
                                            {user.mobileNumber || 'No phone provided'}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="p-3 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl space-y-1">
                                    <Link to="/profile" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                                        <User size={16} className="text-gray-500" /> Edit Profile
                                    </Link>
                                    <Link to="/settings" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                                        <Settings size={16} className="text-gray-500" /> Settings
                                    </Link>
                                    <Link to="/payments" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                                        <CreditCard size={16} className="text-gray-500" /> Payments
                                    </Link>
                                    <div className="h-px bg-gray-200 my-2"></div>
                                    <button 
                                        onClick={handleLogout} 
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-red-600 font-bold rounded-xl hover:bg-red-100 hover:text-red-700 transition-colors"
                                    >
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
