import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    
    // Form states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            if (isLogin) {
                // Login Flow
                const response = await api.post('/auth/login', { email, password });
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('token', response.data.token);
                navigate('/');
            } else {
                // Signup Flow
                const payload = { name, email, mobileNumber, address, password };
                const response = await api.post('/auth/signup', payload);
                // After successful signup, log them in automatically
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('token', response.data.token);
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-blue-600">Inventory System</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {isLogin ? 'Sign in to your account' : 'Create a new account'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required={!isLogin} 
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-1">Mobile Number</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                    value={mobileNumber} 
                                    onChange={(e) => setMobileNumber(e.target.value)} 
                                    required={!isLogin} 
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-1">Address</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                    value={address} 
                                    onChange={(e) => setAddress(e.target.value)} 
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1">Password</label>
                        <input 
                            type="password" 
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-bold mt-6"
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
