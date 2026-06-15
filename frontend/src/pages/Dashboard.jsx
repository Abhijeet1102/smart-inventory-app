import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
    Package, ShoppingCart, Users, IndianRupee, AlertTriangle, 
    TrendingUp, Activity, Phone, MapPin, Mail, ShieldCheck,
    PlusCircle, ArrowRight
} from 'lucide-react';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCustomers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        lowStockProducts: []
    });
    const [isLoading, setIsLoading] = useState(true);

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
            const [productsRes, customersRes, ordersRes] = await Promise.all([
                api.get('/products'),
                api.get('/customers'),
                api.get('/orders')
            ]);

            const products = productsRes.data || [];
            const customers = customersRes.data || [];
            const orders = ordersRes.data || [];

            // Calculate metrics
            const revenue = orders.reduce((sum, order) => sum + (order.totalPaid || 0), 0);
            const lowStock = products.filter(p => p.quantity < 10);

            setStats({
                totalProducts: products.length,
                totalCustomers: customers.length,
                totalOrders: orders.length,
                totalRevenue: revenue,
                lowStockProducts: lowStock
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
            
            {/* 1. User Profile Section */}
            {user && (
                <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500 opacity-10 blur-3xl"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Avatar */}
                        <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center text-4xl font-extrabold shadow-lg shrink-0">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
                                <h1 className="text-3xl font-extrabold tracking-tight">{user.name}</h1>
                                <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    <ShieldCheck size={14} /> {user.role || 'STANDARD'}
                                </span>
                            </div>
                            <p className="text-blue-200 mb-6 font-medium">Welcome back to your Inventory Command Center.</p>
                            
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-blue-100 bg-white/10 rounded-xl py-2 px-4 backdrop-blur-sm w-max">
                                    <MapPin size={16} className="text-blue-300" />
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
                
                {/* Low Stock Alerts */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-red-50 p-6 border-b border-red-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-red-800 flex items-center gap-2">
                                <AlertTriangle size={24} /> Low Stock Alerts
                            </h3>
                            <p className="text-red-600/80 text-sm mt-1">Products with less than 10 units remaining</p>
                        </div>
                        <div className="bg-red-100 text-red-700 font-bold px-4 py-2 rounded-xl text-sm">
                            {stats.lowStockProducts.length} Items
                        </div>
                    </div>
                    <div className="p-0">
                        {stats.lowStockProducts.length === 0 ? (
                            <div className="p-10 text-center">
                                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <ShieldCheck size={32} />
                                </div>
                                <h4 className="text-gray-900 font-bold text-lg">Inventory is Healthy!</h4>
                                <p className="text-gray-500 text-sm">You have no products running out of stock.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                                {stats.lowStockProducts.map(product => (
                                    <li key={product.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 font-bold text-xs">
                                                ID: {product.id}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{product.name}</p>
                                                <p className="text-xs text-gray-500">Category: {product.category?.name || 'Uncategorized'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-red-600 font-extrabold text-lg">{product.quantity} Left</p>
                                            <p className="text-xs text-gray-500 font-medium">Reorder soon</p>
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
                        <Link to="/orders" className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-2xl group transition-all">
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
                        
                        <Link to="/products" className="flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-2xl group transition-all">
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

                        <Link to="/customers" className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-2xl group transition-all">
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
