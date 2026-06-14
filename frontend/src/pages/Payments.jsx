import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, ArrowUpRight, ArrowDownRight, Building2, Plus, ReceiptText, ShieldCheck, Banknote, Trash2, X, ChevronDown, ChevronUp, Filter, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Payments = () => {
    const [user, setUser] = useState({});
    
    const [paymentMethods, setPaymentMethods] = useState(() => {
        const savedMethods = localStorage.getItem('paymentMethods');
        if (savedMethods) {
            return JSON.parse(savedMethods);
        }
        return [
            { id: 1, type: 'UPI', label: 'Google Pay', detail: '9876543210@okicici' },
            { id: 2, type: 'Bank', label: 'HDFC Bank', detail: '•••• 4521' }
        ];
    });

    const [selectedUpiId, setSelectedUpiId] = useState(() => {
        const saved = localStorage.getItem('selectedUpiId');
        return saved ? JSON.parse(saved) : 1;
    });
    const [selectedBankId, setSelectedBankId] = useState(() => {
        const saved = localStorage.getItem('selectedBankId');
        return saved ? JSON.parse(saved) : 2;
    });

    useEffect(() => {
        if (selectedUpiId !== null) localStorage.setItem('selectedUpiId', JSON.stringify(selectedUpiId));
        else localStorage.removeItem('selectedUpiId');
    }, [selectedUpiId]);

    useEffect(() => {
        if (selectedBankId !== null) localStorage.setItem('selectedBankId', JSON.stringify(selectedBankId));
        else localStorage.removeItem('selectedBankId');
    }, [selectedBankId]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMethodType, setNewMethodType] = useState('UPI'); // UPI or Bank
    const [newMethodLabel, setNewMethodLabel] = useState('');
    const [newMethodDetail, setNewMethodDetail] = useState('');

    const [transactions, setTransactions] = useState([]);
    const [currentBalance, setCurrentBalance] = useState(0);
    const [showAllTransactions, setShowAllTransactions] = useState(false);
    const [filterType, setFilterType] = useState('ALL');
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedMethods = localStorage.getItem('paymentMethods');
        
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        }
    }, []);

    // Save payment methods to localStorage when they change
    useEffect(() => {
        localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
    }, [paymentMethods]);

    useEffect(() => {
        const fetchPaymentsData = async () => {
            try {
                const response = await api.get('/orders');
                const orders = response.data;
                
                let total = 0;
                const mappedTxns = orders.map(order => {
                    total += order.totalPaid || 0;
                    
                    let dateStr = 'Unknown Date';
                    if (Array.isArray(order.orderDate)) {
                        const [y, m, d] = order.orderDate;
                        dateStr = new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                    } else if (order.orderDate && typeof order.orderDate === 'string') {
                        if (order.orderDate.includes('-') && order.orderDate.split('-').length === 3) {
                            const parts = order.orderDate.split('-');
                            // Assuming DD-MM-YYYY from backend
                            if (parts[0].length === 2 && parts[2].length === 4) {
                                dateStr = new Date(parts[2], parts[1] - 1, parts[0]).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                            } else {
                                // Fallback for YYYY-MM-DD
                                dateStr = new Date(order.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                            }
                        } else {
                            dateStr = new Date(order.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                        }
                    }

                    return {
                        id: order.id || 'TXN-' + Math.floor(Math.random()*10000),
                        type: 'Credit',
                        amount: order.totalPaid || 0,
                        date: dateStr,
                        source: order.paymentMethod ? `${order.paymentMethod} Payment` : 'Order Payment'
                    };
                }).filter(txn => txn.amount > 0);

                // Reverse to show latest first (assuming API returns older first)
                mappedTxns.reverse();

                setCurrentBalance(total);
                setTransactions(mappedTxns);
            } catch (error) {
                console.error("Error fetching orders for payments", error);
            }
        };
        
        fetchPaymentsData();
    }, []);

    const handleDeleteMethod = (id) => {
        setPaymentMethods(prev => prev.filter(m => m.id !== id));
        if (selectedUpiId === id) setSelectedUpiId(null);
        if (selectedBankId === id) setSelectedBankId(null);
        toast.success('Payment method removed');
    };

    const handleSelectMethod = (id, type) => {
        if (type === 'UPI') setSelectedUpiId(id);
        if (type === 'Bank') setSelectedBankId(id);
    };

    const handleAddMethod = (e) => {
        e.preventDefault();
        if (!newMethodLabel || !newMethodDetail) {
            toast.error('Please fill all fields');
            return;
        }
        
        const newMethod = {
            id: Date.now(),
            type: newMethodType,
            label: newMethodLabel,
            detail: newMethodType === 'Bank' ? `•••• ${newMethodDetail.slice(-4)}` : newMethodDetail
        };

        setPaymentMethods(prev => [...prev, newMethod]);
        toast.success('Payment method added successfully');
        
        // Reset and close
        setNewMethodLabel('');
        setNewMethodDetail('');
        setIsModalOpen(false);
    };

    const filteredTransactions = transactions.filter(txn => {
        if (filterType === 'ALL') return true;
        if (filterType === 'CASH') return txn.source.toUpperCase().includes('CASH');
        if (filterType === 'UPI') return txn.source.toUpperCase().includes('UPI');
        if (filterType === 'CARD') return txn.source.toUpperCase().includes('CARD');
        return true;
    });

    return (
        <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg">
                        <CreditCard size={28} />
                    </div>
                    Payments & Billing
                </h2>
                <p className="mt-2 text-sm text-gray-500 ml-14">
                    Manage your payment methods, view transaction history, and check balances.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Balances & Cards */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Wallet Card */}
                    <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-white opacity-5 blur-2xl"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                    <Wallet size={20} className="text-blue-300" />
                                    <span className="font-semibold text-blue-200">Current Balance</span>
                                </div>
                                <ShieldCheck size={24} className="text-green-400" />
                            </div>
                            
                            <h3 className="text-4xl font-black mb-1">₹{currentBalance.toLocaleString()}<span className="text-lg text-blue-300">.00</span></h3>
                            <p className="text-sm text-blue-200 mb-6">Available to withdraw</p>

                            <div className="flex gap-3">
                                <button className="flex-1 bg-white text-blue-900 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-md">
                                    Withdraw
                                </button>
                                <button className="flex-1 bg-blue-700 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors border border-blue-500 shadow-md">
                                    Add Funds
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods Section */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Banknote size={20} className="text-blue-600" /> Payment Methods
                            </h3>
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1 text-sm font-bold pr-3" 
                                title="Add New"
                            >
                                <Plus size={16} /> Add
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            {paymentMethods.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    No payment methods saved. Click Add to save one.
                                </p>
                            ) : (
                                paymentMethods.map((method, idx) => {
                                    const isSelected = (method.type === 'UPI' && selectedUpiId === method.id) || 
                                                       (method.type === 'Bank' && selectedBankId === method.id);
                                    
                                    return (
                                        <div 
                                            key={method.id} 
                                            onClick={() => handleSelectMethod(method.id, method.type)}
                                            className={`p-4 border rounded-2xl cursor-pointer group flex items-center justify-between relative overflow-hidden transition-all ${
                                                isSelected 
                                                    ? 'border-blue-500 bg-blue-50/50 shadow-sm' 
                                                    : 'border-gray-100 bg-white hover:border-blue-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 relative z-10">
                                                <div className={`w-10 h-10 rounded-xl shadow-sm flex items-center justify-center font-black text-xs border ${
                                                    method.type === 'UPI' 
                                                        ? isSelected ? 'bg-green-100 border-green-200 text-green-700' : 'bg-green-50 border-gray-100 text-green-600'
                                                        : isSelected ? 'bg-blue-100 border-blue-200 text-blue-700' : 'bg-blue-50 border-gray-100 text-blue-600'
                                                }`}>
                                                    {method.type === 'UPI' ? 'UPI' : <Building2 size={18} />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{method.label}</p>
                                                    <p className="text-xs text-gray-500">{method.detail}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 relative z-20">
                                                {/* Radio button indicating selection */}
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                                    isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                                                }`}>
                                                    {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                </div>
                                                
                                                {/* Delete button */}
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteMethod(method.id); }}
                                                    className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors"
                                                    title="Delete Method"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Transactions */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-full">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <ReceiptText size={20} className="text-indigo-600" /> Recent Transactions
                            </h3>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => {
                                        const doc = new jsPDF();
                                        doc.text("Transaction History", 14, 15);
                                        
                                        const tableColumn = ["Transaction ID", "Date", "Source", "Amount"];
                                        const tableRows = [];

                                        filteredTransactions.forEach(txn => {
                                            tableRows.push([
                                                txn.id,
                                                txn.date,
                                                txn.source,
                                                `Rs. ${txn.amount}`
                                            ]);
                                        });

                                        doc.autoTable({
                                            head: [tableColumn],
                                            body: tableRows,
                                            startY: 20,
                                        });
                                        
                                        doc.save(`transactions_${new Date().getTime()}.pdf`);
                                        toast.success('Downloaded as PDF');
                                    }}
                                    className="p-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1 text-xs font-bold" 
                                    title="Export PDF"
                                >
                                    <Download size={14} /> Export
                                </button>
                                
                                <div className="relative">
                                    <button 
                                        onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                                        className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold ${isFilterMenuOpen || filterType !== 'ALL' ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`} 
                                        title="Filter Transactions"
                                    >
                                        <Filter size={14} /> {filterType === 'ALL' ? 'Filter' : filterType}
                                    </button>
                                    
                                    {isFilterMenuOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                            {['ALL', 'CASH', 'UPI', 'CARD'].map(type => (
                                                <button 
                                                    key={type}
                                                    onClick={() => { setFilterType(type); setIsFilterMenuOpen(false); }}
                                                    className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-gray-50 transition-colors ${filterType === type ? 'text-blue-600 bg-blue-50/50' : 'text-gray-700'}`}
                                                >
                                                    {type === 'ALL' ? 'All Types' : type}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="w-px h-4 bg-gray-200 mx-1"></div>
                                <button 
                                    onClick={() => setShowAllTransactions(!showAllTransactions)}
                                    className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 ml-1"
                                >
                                    {showAllTransactions ? (
                                        <>Show Less <ChevronUp size={16} /></>
                                    ) : (
                                        <>View All <ChevronDown size={16} /></>
                                    )}
                                </button>
                            </div>
                        </div>
                        
                        <div className={`divide-y divide-gray-50 overflow-y-auto ${showAllTransactions ? 'max-h-[600px]' : ''}`}>
                            {filteredTransactions.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <ReceiptText size={48} className="mx-auto text-gray-300 mb-3" />
                                    <p className="font-semibold text-gray-600">No transactions found</p>
                                    <p className="text-sm">No payments match your current filter.</p>
                                </div>
                            ) : (
                                filteredTransactions.slice(0, showAllTransactions ? filteredTransactions.length : 4).map((txn, idx) => (
                                    <div key={idx} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                                                txn.type === 'Credit' 
                                                    ? 'bg-green-50 text-green-600' 
                                                    : 'bg-red-50 text-red-600'
                                            }`}>
                                                {txn.type === 'Credit' ? <ArrowDownRight size={24} /> : <ArrowUpRight size={24} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{txn.source}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                                                        {txn.id}
                                                    </span>
                                                    <span className="text-xs text-gray-400">{txn.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="text-right">
                                            <p className={`font-extrabold text-lg ${
                                                txn.type === 'Credit' ? 'text-green-600' : 'text-gray-900'
                                            }`}>
                                                {txn.type === 'Credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                                            </p>
                                            <p className="text-xs font-medium text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-blue-600">
                                                Download Receipt
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Adding Payment Method */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    
                    {/* Modal Content */}
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900">Add Payment Method</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-gray-50 hover:bg-red-50 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddMethod} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Method Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setNewMethodType('UPI')}
                                        className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                                            newMethodType === 'UPI' 
                                            ? 'border-blue-600 bg-blue-50 text-blue-700' 
                                            : 'border-gray-200 text-gray-500 hover:border-blue-300'
                                        }`}
                                    >
                                        UPI ID
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setNewMethodType('Bank')}
                                        className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                                            newMethodType === 'Bank' 
                                            ? 'border-blue-600 bg-blue-50 text-blue-700' 
                                            : 'border-gray-200 text-gray-500 hover:border-blue-300'
                                        }`}
                                    >
                                        Bank Account
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    {newMethodType === 'UPI' ? 'App Name (e.g. PhonePe)' : 'Bank Name'}
                                </label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder={newMethodType === 'UPI' ? 'e.g. Google Pay' : 'e.g. State Bank of India'}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newMethodLabel}
                                    onChange={(e) => setNewMethodLabel(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    {newMethodType === 'UPI' ? 'UPI ID' : 'Account Number'}
                                </label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder={newMethodType === 'UPI' ? 'name@okhdfcbank' : '123456789012'}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newMethodDetail}
                                    onChange={(e) => setNewMethodDetail(e.target.value)}
                                />
                            </div>

                            <button 
                                type="submit"
                                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-all mt-4"
                            >
                                Save Payment Method
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payments;
