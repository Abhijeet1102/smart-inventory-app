import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Receipt, Search, Calendar, User, IndianRupee, FileText, X, TrendingUp, BarChart3, Target, Package } from 'lucide-react';

// Get today's date in IST formatted as YYYY-MM-DD
const getTodayIST = () => {
    try {
        return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    } catch (e) {
        const d = new Date();
        return d.toISOString().split('T')[0];
    }
};

// Extremely robust date parser to handle Spring Boot Arrays and String formats
const parseBackendDate = (dateVal) => {
    if (!dateVal) return '';
    
    // 1. Handle Spring Boot Array format: [2024, 6, 14]
    if (Array.isArray(dateVal)) {
        if (dateVal.length >= 3) {
            const year = dateVal[0];
            const month = String(dateVal[1]).padStart(2, '0');
            const day = String(dateVal[2]).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    }
    
    // 2. Handle string formats
    if (typeof dateVal === 'string') {
        if (dateVal.includes('-')) {
            const parts = dateVal.split('T')[0].split('-'); // strip time if present
            if (parts.length === 3) {
                // YYYY-MM-DD
                if (parts[0].length === 4) return `${parts[0]}-${parts[1]}-${parts[2]}`;
                
                // DD-MM-YYYY
                if (parts[2].length >= 4) {
                    const day = parts[0].padStart(2, '0');
                    const month = parts[1].padStart(2, '0');
                    const year = parts[2].substring(0, 4);
                    return `${year}-${month}-${day}`;
                }
            }
        }
        
        // 3. Fallback standard parsing
        try {
            const d = new Date(dateVal);
            if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
        } catch(e) {}
    }
    
    return '';
};

const ViewOrders = () => {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState(getTodayIST()); // Default to today's date
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [ordersRes, custRes] = await Promise.all([
                api.get('/orders'),
                api.get('/customers')
            ]);
            
            // Safe array check before sorting
            const rawOrders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
            const sortedOrders = rawOrders.sort((a, b) => {
                const aFormatted = parseBackendDate(a.orderDate);
                const bFormatted = parseBackendDate(b.orderDate);
                const dateA = aFormatted ? new Date(aFormatted).getTime() : 0;
                const dateB = bFormatted ? new Date(bFormatted).getTime() : 0;
                return dateB - dateA;
            });
            
            setOrders(sortedOrders);
            setCustomers(Array.isArray(custRes.data) ? custRes.data : []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load orders data');
        } finally {
            setIsLoading(false);
        }
    };

    const getCustomerDetails = (id) => {
        const cust = customers.find(c => c.id === id);
        return cust || null;
    };

    const formatDate = (rawDate) => {
        if (!rawDate) return 'N/A';
        
        const formatted = parseBackendDate(rawDate);
        if (!formatted) return String(rawDate); // Fallback to raw string
        
        try {
            const date = new Date(formatted);
            if (isNaN(date.getTime())) return String(rawDate);
            
            return new Intl.DateTimeFormat('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }).format(date);
        } catch (e) {
            return String(rawDate);
        }
    };

    // Filter orders based on search and date
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            // 1. Date Filter
            if (selectedDate) {
                const orderDateIST = parseBackendDate(order.orderDate);
                if (orderDateIST !== selectedDate) {
                    return false; // Skip if it doesn't match the selected date
                }
            }

            // 2. Search Filter
            if (searchQuery) {
                const lowerQuery = searchQuery.toLowerCase();
                const cust = getCustomerDetails(order.customerId);
                
                // Safe string conversions before searching
                const orderIdStr = order.orderId ? String(order.orderId).toLowerCase() : '';
                const custNameStr = cust?.name ? String(cust.name).toLowerCase() : '';
                const custMobileStr = cust?.mobileNumber ? String(cust.mobileNumber).toLowerCase() : '';
                
                if (
                    !orderIdStr.includes(lowerQuery) && 
                    !custNameStr.includes(lowerQuery) &&
                    !custMobileStr.includes(lowerQuery)
                ) {
                    return false;
                }
            }

            return true;
        });
    }, [orders, searchQuery, selectedDate, customers]);

    const safeTotalPaid = (amount) => {
        return Number(amount || 0).toLocaleString();
    };

    // Dashboard Calculations
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + Number(order.totalPaid || 0), 0);
    const totalOrderCount = filteredOrders.length;
    const aov = totalOrderCount > 0 ? Math.round(totalRevenue / totalOrderCount) : 0;

    const handlePrintReceipt = (order, customer) => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        const formattedDate = formatDate(order.orderDate);
        const orderId = order.orderId || (order.id ? String(order.id).substring(0,8).toUpperCase() : 'UNKNOWN');
        const custName = customer?.name ? String(customer.name) : 'Walk-in Customer';
        const custMobile = customer?.mobileNumber ? String(customer.mobileNumber) : 'N/A';
        const paymentMethod = order.paymentMethod ? String(order.paymentMethod).toUpperCase() : 'CASH';
        
        const itemsHtml = (Array.isArray(order.cartItems) ? order.cartItems : []).map(item => `
            <tr>
                <td class="item-name">${item.name || 'Unknown Item'}</td>
                <td class="center">${item.quantity || 0}</td>
                <td class="right">${Number(item.price || 0).toLocaleString()}</td>
                <td class="right">${Number(item.subTotal || 0).toLocaleString()}</td>
            </tr>
        `).join('');

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Receipt - Order #${orderId}</title>
                <style>
                    @page { margin: 0; size: 80mm auto; }
                    body { 
                        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
                        margin: 0; 
                        padding: 10mm 6mm; 
                        color: #111; 
                        font-size: 12px;
                        line-height: 1.4;
                        background: #fff;
                    }
                    .header { text-align: center; margin-bottom: 20px; }
                    .header h2 { margin: 0; font-size: 20px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; color: #000; }
                    .header p { margin: 4px 0; font-size: 11px; color: #555; text-transform: uppercase; letter-spacing: 0.5px; }
                    .barcode { margin: 10px auto; font-family: 'Libre Barcode 39', cursive, monospace; font-size: 32px; letter-spacing: -2px; }
                    .divider { border-top: 1.5px dashed #ccc; margin: 15px 0; }
                    .details { margin-bottom: 15px; font-size: 12px; }
                    .details table { width: 100%; border-collapse: collapse; }
                    .details td { padding: 3px 0; color: #333; }
                    .details td.label { color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
                    .details td:last-child { text-align: right; font-weight: 600; }
                    
                    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 12px; }
                    .items-table th { border-bottom: 2px solid #eee; padding-bottom: 8px; text-align: left; color: #888; font-size: 10px; text-transform: uppercase; }
                    .items-table th.center, .items-table td.center { text-align: center; }
                    .items-table th.right, .items-table td.right { text-align: right; }
                    .items-table td { padding: 8px 0; vertical-align: top; border-bottom: 1px solid #f9f9f9; }
                    .item-name { max-width: 110px; font-weight: 600; }
                    
                    .totals { margin-top: 15px; }
                    .totals table { width: 100%; font-size: 13px; }
                    .totals td { padding: 4px 0; }
                    .totals .label { color: #666; }
                    .totals .grand-total { font-weight: 900; font-size: 18px; border-top: 2px solid #000; padding-top: 10px; margin-top: 5px; }
                    
                    .footer { text-align: center; margin-top: 30px; }
                    .footer p { font-size: 11px; color: #666; margin: 4px 0; }
                    .footer .greeting { font-weight: bold; font-size: 13px; color: #000; margin-bottom: 8px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>INVENTORY STORE</h2>
                    <p>Official Tax Receipt</p>
                    <div class="barcode">*${orderId}*</div>
                </div>
                
                <div class="details">
                    <table>
                        <tr>
                            <td class="label">Receipt No:</td>
                            <td>#${orderId}</td>
                        </tr>
                        <tr>
                            <td class="label">Date:</td>
                            <td>${formattedDate}</td>
                        </tr>
                        <tr>
                            <td class="label">Customer:</td>
                            <td>${custName}</td>
                        </tr>
                        <tr>
                            <td class="label">Mobile:</td>
                            <td>${custMobile}</td>
                        </tr>
                    </table>
                </div>

                <div class="divider"></div>

                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th class="center">Qty</th>
                            <th class="right">Price</th>
                            <th class="right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>

                <div class="totals">
                    <table>
                        <tr>
                            <td class="label">Payment Method</td>
                            <td style="text-align: right; font-weight: bold;">${paymentMethod}</td>
                        </tr>
                        <tr>
                            <td class="label">Tax Included</td>
                            <td style="text-align: right;">Rs. 0</td>
                        </tr>
                        <tr class="grand-total">
                            <td>TOTAL PAID</td>
                            <td style="text-align: right;">Rs. ${safeTotalPaid(order.totalPaid)}</td>
                        </tr>
                    </table>
                </div>

                <div class="divider"></div>

                <div class="footer">
                    <p class="greeting">Thank You For Your Purchase!</p>
                    <p>Please keep this receipt for returns or exchanges within 14 days.</p>
                </div>

                <script>
                    window.onload = function() {
                        setTimeout(() => { window.print(); }, 500);
                    }
                </script>
            </body>
            </html>
        `;

        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(html);
        iframe.contentWindow.document.close();

        setTimeout(() => {
            if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
            }
        }, 5000); // Wait longer to ensure print dialog triggers before removing
    };

    const clearDateFilter = () => {
        setSelectedDate('');
    };

    return (
        <div className="max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg">
                            <FileText size={28} />
                        </div>
                        Order History
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 ml-14">
                        Analyze sales and access historical customer receipts
                    </p>
                </div>
                
                {/* Advanced Filters */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Calendar size={18} className="text-blue-500" />
                        </div>
                        <input
                            type="date"
                            className="w-full sm:w-48 pl-10 pr-8 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700 cursor-pointer"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        {selectedDate && (
                            <button 
                                onClick={clearDateFilter}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500 transition-colors"
                                title="Show All Dates"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div className="w-px bg-gray-200 hidden sm:block mx-1"></div>

                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search Order ID or Customer..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Revenue Insights Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl shadow-lg border border-gray-700 flex items-center gap-4 relative overflow-hidden">
                    <div className="p-4 bg-gray-800 text-emerald-400 rounded-2xl relative z-10 ring-1 ring-white/10">
                        <IndianRupee size={28} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
                        <h3 className="text-3xl font-black text-white mt-1 flex items-center tracking-tight">
                            <IndianRupee size={24} className="mr-0.5 opacity-80" />
                            {safeTotalPaid(totalRevenue)}
                        </h3>
                    </div>
                    <div className="absolute right-0 bottom-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl relative z-10">
                        <Package size={28} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Orders</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-1">{totalOrderCount}</h3>
                    </div>
                    <BarChart3 className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-blue-50 opacity-60" />
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden">
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl relative z-10">
                        <TrendingUp size={28} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Order Value</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-1 flex items-center">
                            <IndianRupee size={24} className="mr-0.5 text-gray-400" />
                            {safeTotalPaid(aov)}
                        </h3>
                    </div>
                    <Target className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-indigo-50 opacity-50" />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col max-h-[calc(100vh-25rem)] min-h-[400px]">
                <div className="overflow-y-auto flex-1">
                    {isLoading ? (
                        <div className="p-16 text-center text-gray-500 h-full flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600 mx-auto mb-4"></div>
                            Loading order history...
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="p-16 text-center h-full flex flex-col items-center justify-center">
                            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                                <Receipt size={40} className="text-gray-400" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">No orders found</h4>
                            <p className="text-gray-500 max-w-sm mx-auto">
                                {selectedDate 
                                    ? `There are no orders recorded for ${new Date(selectedDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium' })}.`
                                    : searchQuery 
                                        ? `We couldn't find any orders matching "${searchQuery}".` 
                                        : "You haven't processed any orders yet. Head over to Manage Orders to create your first sale!"}
                            </p>
                            {(searchQuery || selectedDate) && (
                                <button 
                                    onClick={() => { setSearchQuery(''); setSelectedDate(''); }}
                                    className="mt-6 text-blue-600 hover:text-blue-800 font-bold px-6 py-2.5 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10 shadow-sm">
                                <tr className="text-gray-500 text-xs uppercase tracking-wider font-bold border-b border-gray-200">
                                    <th className="py-4 px-6">Order ID</th>
                                    <th className="py-4 px-6">Date (IST)</th>
                                    <th className="py-4 px-6">Customer Details</th>
                                    <th className="py-4 px-6 text-center">Receipt</th>
                                    <th className="py-4 px-6 text-right">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order, index) => {
                                    const cust = getCustomerDetails(order.customerId);
                                    
                                    return (
                                        <tr key={order.id || index} className="hover:bg-blue-50/40 transition-colors group">
                                            <td className="py-4 px-6 text-sm">
                                                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg shadow-sm">
                                                    #{order.orderId || (order.id ? String(order.id).substring(0,8).toUpperCase() : 'UNKNOWN')}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                                    <Calendar size={16} className="text-blue-400" />
                                                    {formatDate(order.orderDate)}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center text-gray-700 text-sm font-black shadow-inner">
                                                        {cust?.name ? String(cust.name).charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-900 text-base leading-tight">{cust?.name ? String(cust.name) : 'Walk-in Customer'}</span>
                                                        <span className="text-xs font-medium text-gray-500 mt-0.5">{cust?.mobileNumber ? String(cust.mobileNumber) : 'No mobile provided'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex justify-center">
                                                    <button 
                                                        className="px-4 py-2 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-2"
                                                        onClick={() => handlePrintReceipt(order, cust)}
                                                    >
                                                        <Receipt size={16} /> Print
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <span className="font-black text-gray-900 flex items-center justify-end gap-1 text-lg">
                                                    <IndianRupee size={18} className="text-emerald-500" />
                                                    {safeTotalPaid(order.totalPaid)}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
                
                {/* Footer Stats - Kept light since Dashboard exists */}
                {!isLoading && filteredOrders.length > 0 && (
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0">
                        <span>
                            Displaying {filteredOrders.length} records
                        </span>
                        <span>
                            Data automatically sorted by latest
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewOrders;
