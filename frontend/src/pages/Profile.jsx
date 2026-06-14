import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Shield, Lock, Save, Camera, CreditCard, Building2, Plus } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setName(parsedUser.name || '');
            setEmail(parsedUser.email || '');
            setMobileNumber(parsedUser.mobileNumber || '');
            setAddress(parsedUser.address || '');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const loadToast = toast.loading('Saving profile changes...');

        try {
            const updatePayload = {
                id: user.id,
                name,
                email,
                mobileNumber,
                address,
                status: user.status, // Keep existing
                userRole: user.userRole // Keep existing
            };

            // Only send password if user typed a new one
            if (password.trim() !== '') {
                updatePayload.password = password;
            }

            const res = await api.put(`/users/${user.id}`, updatePayload);
            
            // Update local storage so navbar changes instantly
            const updatedUser = { ...user, ...res.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setPassword(''); // Clear password field for security
            
            toast.success('Profile updated successfully!', { id: loadToast });
            
            // Force a hard reload if name changed to update Dashboard/Navbar easily
            // OR we can just rely on the next navigation. For a seamless feel, just toast.
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile. Please try again.', { id: loadToast });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg">
                        <User size={28} />
                    </div>
                    Profile Settings
                </h2>
                <p className="mt-2 text-sm text-gray-500 ml-14">
                    Manage your personal information and security preferences
                </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Banner & Avatar section */}
                <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
                    {/* Role Badge */}
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm border border-white/20 uppercase tracking-wide">
                        <Shield size={16} /> {user.userRole || 'User'}
                    </div>
                </div>

                <div className="px-8 pb-8 relative">
                    {/* Avatar Profile Picture */}
                    <div className="relative -mt-16 mb-8 w-max">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-white flex items-center justify-center text-5xl font-black text-gray-700 shadow-xl border-4 border-white relative z-10">
                            {(user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <button className="absolute bottom-2 right-2 p-2.5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all z-20 border-2 border-white cursor-pointer" title="Upload Photo">
                            <Camera size={16} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* Personal Details Section */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mobile Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Phone size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                                            value={mobileNumber}
                                            onChange={(e) => setMobileNumber(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Address / Location</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <MapPin size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-inner">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Lock size={20} className="text-indigo-500" /> Security
                            </h3>
                            <div className="max-w-md">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Update Password</label>
                                <div className="relative mb-2">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Leave blank to keep current password"
                                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 font-medium">Type a new password only if you wish to change your existing one.</p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                                ) : (
                                    <><Save size={20} /> Save Profile Changes</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
