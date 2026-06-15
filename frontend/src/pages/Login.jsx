import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Package, Mail, Lock, User, Phone, MapPin, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    
    // Form states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            if (isLogin) {
                // Login Flow
                const response = await api.post('/auth/login', { email, password });
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            } else {
                // Signup Flow
                const payload = { name, email, mobileNumber, address, password };
                const response = await api.post('/auth/signup', payload);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-blue-200">
            {/* Left Panel - Branding (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden flex-col justify-between p-12 text-white">
                {/* Decorative Gradients */}
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-60"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-60"></div>

                <div className="relative z-10">
                    <Link to="/" className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-lg">
                            <Package size={28} />
                        </div>
                        <span className="text-3xl font-black tracking-tight">SmartInventory</span>
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 font-bold text-sm mb-6">
                        <ShieldCheck size={16} className="text-blue-400" /> Enterprise-Grade Security
                    </div>
                    <h1 className="text-5xl font-extrabold leading-tight mb-6">
                        Manage your business <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">with absolute precision.</span>
                    </h1>
                    <p className="text-xl text-gray-300 font-medium leading-relaxed">
                        Join thousands of businesses streamlining their supply chain, protecting their data, and accelerating growth.
                    </p>
                </div>
                
                <div className="relative z-10 flex items-center gap-4 text-sm font-bold text-gray-400">
                    <span>© {new Date().getFullYear()} SmartInventory</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span>All systems operational</span>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                {/* Back to Home Button for Mobile */}
                <Link to="/" className="absolute top-6 left-6 lg:hidden flex items-center gap-2 text-gray-600 font-bold text-sm bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                    <Package size={16} className="text-blue-600" /> SmartInventory
                </Link>

                <div className="w-full max-w-md animate-fade-in-up">
                    <div className="text-center lg:text-left mb-10">
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
                            {isLogin ? 'Welcome back' : 'Create an account'}
                        </h2>
                        <p className="text-gray-500 font-medium">
                            {isLogin ? 'Enter your details to access your dashboard.' : 'Sign up to start managing your inventory today.'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl mb-6 shadow-sm flex items-center gap-3 font-medium text-sm animate-fade-in">
                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                                <span className="text-red-500 font-black">!</span>
                            </div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div className="space-y-5 animate-fade-in">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-1.5 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                            <User size={18} />
                                        </div>
                                        <input 
                                            type="text" 
                                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm" 
                                            placeholder="John Doe"
                                            value={name} 
                                            onChange={(e) => setName(e.target.value)} 
                                            required={!isLogin} 
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-1.5 ml-1">Mobile</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                                <Phone size={18} />
                                            </div>
                                            <input 
                                                type="tel" 
                                                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm" 
                                                placeholder="+1 234 567 890"
                                                value={mobileNumber} 
                                                onChange={(e) => setMobileNumber(e.target.value)} 
                                                required={!isLogin} 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-1.5 ml-1">Address</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                                <MapPin size={18} />
                                            </div>
                                            <input 
                                                type="text" 
                                                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm" 
                                                placeholder="City, Country"
                                                value={address} 
                                                onChange={(e) => setAddress(e.target.value)} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1.5 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input 
                                    type="email" 
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm" 
                                    placeholder="name@company.com"
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-center mb-1.5 ml-1">
                                <label className="block text-gray-700 text-sm font-bold">Password</label>
                                {isLogin && (
                                    <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</a>
                                )}
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input 
                                    type="password" 
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm" 
                                    placeholder="••••••••"
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-full text-white py-3.5 rounded-xl font-bold mt-8 flex items-center justify-center gap-2 transition-all duration-300 shadow-xl ${isLoading ? 'bg-blue-400 shadow-none cursor-not-allowed' : 'bg-gray-900 hover:bg-black hover:scale-[1.02] shadow-gray-900/20'}`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    {isLogin ? 'Sign In Securely' : 'Create Account'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 font-medium">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button 
                                onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                                className="ml-2 text-gray-900 font-bold hover:text-blue-600 transition-colors underline decoration-2 underline-offset-4"
                            >
                                {isLogin ? "Sign up now" : "Log in instead"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
