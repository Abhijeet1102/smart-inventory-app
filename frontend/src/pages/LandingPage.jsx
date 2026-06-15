import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Package, ShieldCheck, Activity, Users, ShoppingCart, 
    ArrowRight, CheckCircle2, Zap, BarChart3, Clock
} from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                <Package size={24} />
                            </div>
                            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
                                SmartInventory
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-gray-600 font-bold hover:text-blue-600 transition-colors hidden sm:block">
                                Sign In
                            </Link>
                            <Link to="/login" className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-md">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold text-sm mb-8 animate-fade-in-up">
                        <Zap size={16} className="text-blue-600" /> V2.0 Enterprise Release is Live
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight animate-fade-in-up animation-delay-150">
                        Manage Your Inventory with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                            Absolute Precision.
                        </span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto mb-10 animate-fade-in-up animation-delay-300">
                        A powerful, intelligent, and real-time inventory management system built for modern businesses. Track stock, manage customers, and generate orders effortlessly.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-500">
                        <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 group">
                            Start Managing Now
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a href="#features" className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-full font-bold text-lg transition-all border border-gray-200 shadow-sm flex items-center justify-center gap-2">
                            Explore Features
                        </a>
                    </div>
                </div>
            </section>

            {/* Feature Highlights Grid */}
            <section id="features" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">Everything you need to scale</h2>
                        <p className="mt-4 text-xl text-gray-600">Enterprise-grade features packed into a beautifully simple interface.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-slate-50 rounded-3xl p-8 border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                <Activity size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Analytics</h3>
                            <p className="text-gray-600">Get an instant overview of your business health. Track revenue, monitor low stock, and view order trends live on your dashboard.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-slate-50 rounded-3xl p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Bank-grade Security</h3>
                            <p className="text-gray-600">Your data is locked down with advanced JWT (JSON Web Token) encryption. Only authenticated staff can access your business records.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-slate-50 rounded-3xl p-8 border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                                <ShoppingCart size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Seamless Order POS</h3>
                            <p className="text-gray-600">Create orders in seconds. Select customers, add products to the cart, and automatically generate and download professional PDF invoices.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workflow Section */}
            <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-600 rounded-full mix-blend-multiply filter blur-[150px] opacity-20"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black sm:text-4xl mb-4">How it works</h2>
                        <p className="text-xl text-gray-400">A streamlined workflow designed to save you hours every week.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Setup Inventory', desc: 'Add categories and bulk-upload your products with their current stock levels.', icon: Package },
                            { step: '02', title: 'Add Customers', desc: 'Build your client database with detailed contact information for faster checkouts.', icon: Users },
                            { step: '03', title: 'Process Sales', desc: 'Create new orders, manage carts, and instantly deduct sold items from stock.', icon: BarChart3 },
                            { step: '04', title: 'Track & Grow', desc: 'Use the live dashboard to monitor revenue, low stock alerts, and overall growth.', icon: Clock },
                        ].map((item, i) => (
                            <div key={i} className="relative group">
                                <div className="text-6xl font-black text-gray-800 absolute -top-4 -left-4 z-0 group-hover:text-blue-900/50 transition-colors">{item.step}</div>
                                <div className="relative z-10 bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-2xl hover:bg-gray-800 transition-colors h-full">
                                    <item.icon size={32} className="text-blue-400 mb-4" />
                                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-black text-gray-900 mb-6">Ready to take control of your stock?</h2>
                    <p className="text-xl text-gray-600 mb-10">Join smart businesses that rely on our system to manage their daily operations smoothly and securely.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/login" className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl flex items-center justify-center gap-2">
                            Create Free Account
                            <CheckCircle2 size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 border-t border-gray-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm font-medium">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600">
                            <Package size={16} />
                        </div>
                        <span className="font-bold text-gray-700 text-lg">SmartInventory</span>
                    </div>
                    <p>© {new Date().getFullYear()} SmartInventory. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
