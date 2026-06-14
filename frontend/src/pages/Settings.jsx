import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Monitor, Globe, Smartphone, Key, MonitorSmartphone, AlertTriangle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');
    
    // Settings States
    const [theme, setTheme] = useState(localStorage.getItem('appTheme') || 'light');
    const [language, setLanguage] = useState(localStorage.getItem('appLanguage') || 'English');
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [smsAlerts, setSmsAlerts] = useState(false);
    const [twoFactor, setTwoFactor] = useState(false);

    // Apply theme on load
    useEffect(() => {
        applyTheme(theme);
    }, []);

    const applyTheme = (selectedTheme) => {
        const root = document.documentElement;
        let isDark = false;
        
        if (selectedTheme === 'dark') {
            isDark = true;
        } else if (selectedTheme === 'system') {
            isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        if (isDark) {
            root.style.filter = 'invert(1) hue-rotate(180deg)';
            if (!document.getElementById('dark-mode-fixes')) {
                const style = document.createElement('style');
                style.id = 'dark-mode-fixes';
                style.innerHTML = 'img, video, iframe, [style*="background-image"] { filter: invert(1) hue-rotate(180deg); }';
                document.head.appendChild(style);
            }
        } else {
            root.style.filter = 'none';
            const style = document.getElementById('dark-mode-fixes');
            if (style) style.remove();
        }
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        applyTheme(newTheme);
        localStorage.setItem('appTheme', newTheme);
    };

    const handleSave = () => {
        localStorage.setItem('appTheme', theme);
        localStorage.setItem('appLanguage', language);
        
        applyTheme(theme);
        
        document.documentElement.lang = language === 'Hindi' ? 'hi' : language === 'Spanish' ? 'es' : language === 'French' ? 'fr' : 'en';

        toast.success('Settings saved and applied successfully!');
        if (language !== 'English') {
            toast('Language set to ' + language + '. Translations will apply on next restart.', { icon: '🌐' });
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-xl shadow-lg">
                        <SettingsIcon size={28} />
                    </div>
                    System Settings
                </h2>
                <p className="mt-2 text-sm text-gray-500 ml-14">
                    Manage your app preferences, notifications, and security.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar Nav */}
                <div className="lg:col-span-1 space-y-2">
                    <button 
                        onClick={() => setActiveTab('general')}
                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${
                            activeTab === 'general' 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                        }`}
                    >
                        <Monitor size={20} /> General
                    </button>
                    <button 
                        onClick={() => setActiveTab('notifications')}
                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${
                            activeTab === 'notifications' 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                        }`}
                    >
                        <Bell size={20} /> Notifications
                    </button>
                    <button 
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${
                            activeTab === 'security' 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                        }`}
                    >
                        <Shield size={20} /> Security
                    </button>
                </div>

                {/* Right Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
                        
                        {/* GENERAL TAB */}
                        {activeTab === 'general' && (
                            <div className="animate-in fade-in duration-300">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">General Preferences</h3>
                                
                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3">App Theme</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            <button 
                                                onClick={() => handleThemeChange('light')}
                                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${theme === 'light' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                                            >
                                                <Monitor size={24} />
                                                <span className="font-bold text-sm">Light Mode</span>
                                            </button>
                                            <button 
                                                onClick={() => handleThemeChange('dark')}
                                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${theme === 'dark' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                                            >
                                                <Monitor size={24} className="fill-current" />
                                                <span className="font-bold text-sm">Dark Mode</span>
                                            </button>
                                            <button 
                                                onClick={() => handleThemeChange('system')}
                                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${theme === 'system' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                                            >
                                                <MonitorSmartphone size={24} />
                                                <span className="font-bold text-sm">System Auto</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3">Display Language</label>
                                        <div className="relative max-w-md">
                                            <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <select 
                                                value={language}
                                                onChange={(e) => setLanguage(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                            >
                                                <option value="English">English (US)</option>
                                                <option value="Hindi">Hindi (India)</option>
                                                <option value="Spanish">Spanish (ES)</option>
                                                <option value="French">French (FR)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* NOTIFICATIONS TAB */}
                        {activeTab === 'notifications' && (
                            <div className="animate-in fade-in duration-300">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">Notification Settings</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div>
                                            <p className="font-bold text-gray-900">Email Alerts</p>
                                            <p className="text-sm text-gray-500 mt-1">Receive daily reports and order summaries via email.</p>
                                        </div>
                                        <button 
                                            onClick={() => setEmailAlerts(!emailAlerts)}
                                            className={`mt-4 sm:mt-0 relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${emailAlerts ? 'bg-blue-600' : 'bg-gray-300'}`}
                                        >
                                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${emailAlerts ? 'translate-x-8' : 'translate-x-1'}`} />
                                        </button>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div>
                                            <p className="font-bold text-gray-900">SMS Notifications</p>
                                            <p className="text-sm text-gray-500 mt-1">Get text messages for critical stock alerts and security logins.</p>
                                        </div>
                                        <button 
                                            onClick={() => setSmsAlerts(!smsAlerts)}
                                            className={`mt-4 sm:mt-0 relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${smsAlerts ? 'bg-blue-600' : 'bg-gray-300'}`}
                                        >
                                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${smsAlerts ? 'translate-x-8' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECURITY TAB */}
                        {activeTab === 'security' && (
                            <div className="animate-in fade-in duration-300">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">Security & Privacy</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                <Key size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">Two-Factor Authentication (2FA)</p>
                                                <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account.</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setTwoFactor(!twoFactor)}
                                            className={`mt-4 sm:mt-0 relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${twoFactor ? 'bg-green-500' : 'bg-gray-300'}`}
                                        >
                                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${twoFactor ? 'translate-x-8' : 'translate-x-1'}`} />
                                        </button>
                                    </div>

                                    <div className="mt-8 border-t border-gray-100 pt-8">
                                        <h4 className="font-bold text-red-600 flex items-center gap-2 mb-4">
                                            <AlertTriangle size={18} /> Danger Zone
                                        </h4>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-red-50 rounded-2xl border border-red-100">
                                            <div>
                                                <p className="font-bold text-gray-900">Delete Account</p>
                                                <p className="text-sm text-red-600/80 mt-1">Permanently delete your data. This cannot be undone.</p>
                                            </div>
                                            <button 
                                                onClick={() => toast.error('Account deletion requested.')}
                                                className="mt-4 sm:mt-0 bg-white text-red-600 border border-red-200 px-4 py-2 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-colors"
                                            >
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                            <button 
                                onClick={handleSave}
                                className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all hover:-translate-y-0.5"
                            >
                                Save Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
