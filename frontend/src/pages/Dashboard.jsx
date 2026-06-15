import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
    Package, ShoppingCart, Users, IndianRupee, AlertTriangle, 
    TrendingUp, Activity, Phone, MapPin, Mail, ShieldCheck,
    PlusCircle, ArrowRight, Search
} from 'lucide-react';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCustomers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        allProducts: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Load User Profile from Session
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'undefined') {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                // Ignore parse error
            }
        }

        // Fetch Live Statistics
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const [categoriesRes, productsRes, customersRes, ordersRes] = await Promise.all([
                api.get('/categories'),
                api.get('/products'),
                api.get('/customers'),
                api.get('/orders')
            ]);

            const categories = categoriesRes.data || [];
            const products = productsRes.data || [];
            const customers = customersRes.data || [];
            const orders = ordersRes.data || [];

            // Map category names
            const categoryMap = {};
            categories.forEach(c => categoryMap[c.id] = c.name);
            
            const productsWithCategories = products.map(p => ({
                ...p,
                categoryName: categoryMap[p.categoryId] || 'Uncategorized'
            }));

            // Calculate metrics
            const revenue = orders.reduce((sum, order) => sum + (order.totalPaid || 0), 0);
            const sortedProducts = [...productsWithCategories].sort((a, b) => a.quantity - b.quantity);

            setStats({
                totalProducts: products.length,
                totalCustomers: customers.length,
                totalOrders: orders.length,
                totalRevenue: revenue,
                allProducts: sortedProducts
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Loading your command center...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* 1. User Profile Section - Compact */}
            {user && (
                <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 rounded-full bg-white opacity-5 blur-2xl"></div>
                    
                    <div className="relative z-10 flex flex-row items-center gap-5">
                        {/* Avatar */}
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-2xl font-extrabold shadow-sm shrink-0">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-0.5">
                                    <h1 className="text-xl font-bold tracking-tight">{user.name}</h1>
                                    <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                        <ShieldCheck size={10} /> {user.role || 'STANDARD'}
                                    </span>
                                </div>
                                <p className="text-blue-200 text-sm font-medium">Welcome back!</p>
                            </div>
                            
                            <div className="mt-2 md:mt-0">
                                <div className="flex items-center gap-1.5 text-xs text-blue-100 bg-white/10 rounded-lg py-1 px-3 backdrop-blur-sm w-max">
                                    <MapPin size={14} className="text-blue-300" />
                                    <span className="truncate">{user.address || 'No Address Provided'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Key Metrics Section */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Activity size={24} className="text-blue-600" /> Live Business Metrics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Revenue Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                                <IndianRupee size={24} />
                            </div>
                            <span className="flex items-center gap-1 text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                                <TrendingUp size={14} /> +All Time
                            </span>
                        </div>
                        <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider mb-1">Total Revenue</h3>
                        <p className="text-3xl font-extrabold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
                    </div>

                    {/* Orders Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                <ShoppingCart size={24} />
                            </div>
                        </div>
                        <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider mb-1">Completed Orders</h3>
                        <p className="text-3xl font-extrabold text-gray-900">{stats.totalOrders}</p>
                    </div>

                    {/* Products Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                <Package size={24} />
                            </div>
                        </div>
                        <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider mb-1">Inventory Items</h3>
                        <p className="text-3xl font-extrabold text-gray-900">{stats.totalProducts}</p>
                    </div>

                    {/* Customers Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                                <Users size={24} />
                            </div>
                        </div>
                        <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider mb-1">Customer Base</h3>
                        <p className="text-3xl font-extrabold text-gray-900">{stats.totalCustomers}</p>
                    </div>
                </div>
            </div>

            {/* 3. Alerts & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Live Inventory Tracking */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col max-h-[500px]">
                    <div className="bg-blue-50 p-6 border-b border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
                        <div>
                            <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                                <Package size={24} /> Live Inventory Tracking
                            </h3>
                            <p className="text-blue-700/80 text-sm mt-1">Real-time product quantities in stock</p>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative w-full sm:w-56">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search products..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                />
                            </div>
                            <div className="bg-blue-100 text-blue-800 font-bold px-4 py-2 rounded-xl text-sm shrink-0">
                                {stats.allProducts?.length || 0} Total
                            </div>
                        </div>
                    </div>
                    
                    {/* List Container with Scroll */}
                    <div className="p-0 overflow-y-auto flex-1">
                        {stats.allProducts?.length === 0 ? (
                            <div className="p-10 text-center">
                                <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Package size={32} />
                                </div>
                                <h4 className="text-gray-900 font-bold text-lg">No Products Found</h4>
                                <p className="text-gray-500 text-sm">Add some products to track their stock here.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-50">
                                {stats.allProducts?.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(product => (
                                    <li key={product.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            {product.imageBase64 ? (
                                                <img src={product.imageBase64} alt={product.name} className="w-12 h-12 rounded-lg object-cover shadow-sm border border-gray-200 shrink-0" />
                                            ) : (
                                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg shadow-sm shrink-0 ${product.quantity < 10 ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                                    {product.name ? product.name.charAt(0).toUpperCase() : 'P'}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-gray-900">{product.name}</p>
                                                <p className="text-xs text-gray-500">Category: {product.categoryName}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-extrabold text-lg ${product.quantity < 10 ? 'text-red-600' : 'text-emerald-600'}`}>
                                                {product.quantity} Left
                                            </p>
                                            <p className="text-xs text-gray-500 font-medium">
                                                {product.quantity < 10 ? 'Low Stock' : 'Healthy Stock'}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                    <div className="space-y-4 flex-1">
                        <Link to="/dashboard/orders" className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-2xl group transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md">
                                    <ShoppingCart size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-blue-900">Create New Order</p>
                                    <p className="text-xs text-blue-600 font-medium">Process POS checkout</p>
                                </div>
                            </div>
                            <ArrowRight size={20} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        
                        <Link to="/dashboard/products" className="flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-2xl group transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-md">
                                    <PlusCircle size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-emerald-900">Add Product</p>
                                    <p className="text-xs text-emerald-600 font-medium">Update inventory stock</p>
                                </div>
                            </div>
                            <ArrowRight size={20} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link to="/dashboard/customers" className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-2xl group transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center shadow-md">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-purple-900">Manage Customers</p>
                                    <p className="text-xs text-purple-600 font-medium">View client database</p>
                                </div>
                            </div>
                            <ArrowRight size={20} className="text-purple-400 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
