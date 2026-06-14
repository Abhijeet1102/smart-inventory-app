import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
    ShoppingCart, User, Package, Plus, Trash2, Search, CheckCircle, 
    IndianRupee, Minus, CreditCard, X, Info, FileText 
} from 'lucide-react';

const ManageOrders = () => {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    
    // Selection States
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState('1');

    // Payment States
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentStep, setPaymentStep] = useState('SELECT'); // 'SELECT', 'CASH', 'UPI', 'CARD'
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const [customerSearch, setCustomerSearch] = useState('');
    const [productSearch, setProductSearch] = useState('');

    const [hasUPI, setHasUPI] = useState(true);
    const [hasBank, setHasBank] = useState(true);

    useEffect(() => {
        const savedMethodsStr = localStorage.getItem('paymentMethods');
        if (savedMethodsStr) {
            const savedMethods = JSON.parse(savedMethodsStr);
            setHasUPI(savedMethods.some(m => m.type === 'UPI'));
            setHasBank(savedMethods.some(m => m.type === 'Bank'));
        }

        fetchCustomers();
        fetchProducts();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await api.get('/customers');
            setCustomers(res.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast.error('Failed to load customers');
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        }
    };

    const addToCart = () => {
        if (!selectedProduct) {
            toast.error('Please select a product first');
            return;
        }
        
        const qty = parseInt(quantity);
        if (!qty || qty <= 0) {
            toast.error('Please enter a valid quantity');
            return;
        }

        if (selectedProduct.quantity < qty) {
            toast.error(`Only ${selectedProduct.quantity} units left in stock.`);
            return;
        }

        const existingItem = cart.find(item => item.productId === selectedProduct.id);
        if (existingItem) {
            toast.error('Product is already in the cart. Remove it to update quantity.');
            return;
        }

        const cartItem = {
            productId: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            quantity: qty,
            description: selectedProduct.description,
            subTotal: selectedProduct.price * qty
        };

        setCart([...cart, cartItem]);
        toast.success(`Added ${qty} ${selectedProduct.name} to cart`);
        setQuantity('1');
        setSelectedProduct(null);
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.productId !== productId));
        toast.success('Item removed from cart');
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.subTotal, 0);
    };

    const handleCheckoutClick = () => {
        if (!selectedCustomer) {
            toast.error('Please select a customer before checking out.');
            return;
        }
        if (cart.length === 0) {
            toast.error('Your cart is empty.');
            return;
        }
        setPaymentStep('SELECT');
        setSelectedPaymentMethod('');
        setIsPaymentModalOpen(true);
    };

    const handleConfirmPayment = async () => {
        if (!selectedPaymentMethod) {
            toast.error('Please select a payment method.');
            return;
        }

        setIsProcessingPayment(true);
        const loadToast = toast.loading(`Processing ${selectedPaymentMethod} payment...`);

        // Simulate network delay for real payment feel
        await new Promise(resolve => setTimeout(resolve, 1500));

        const payload = {
            customerId: selectedCustomer.id,
            totalPaid: calculateTotal(),
            paymentMethod: selectedPaymentMethod,
            cartItems: cart
        };

        try {
            await api.post('/orders', payload);
            toast.success('Payment confirmed & Order generated successfully!', { id: loadToast });
            setCart([]);
            setSelectedCustomer(null);
            setCustomerSearch('');
            setProductSearch('');
            setSelectedPaymentMethod('');
            setIsPaymentModalOpen(false);
            fetchProducts(); // Refresh stock
        } catch (error) {
            console.error('Error saving order:', error);
            toast.error('Failed to process payment/order.', { id: loadToast });
        } finally {
            setIsProcessingPayment(false);
        }
    };

    // Filtered Lists
    const filteredCustomers = useMemo(() => {
        const matches = customers.filter(c => {
            if (!customerSearch) return true;
            const nameMatch = c.name?.toLowerCase().includes(customerSearch.toLowerCase());
            const mobileMatch = c.mobileNumber?.includes(customerSearch);
            return nameMatch || mobileMatch;
        });
        
        // Reverse to get the most recently added first, then limit to exactly 2
        return matches.reverse().slice(0, 2);
    }, [customers, customerSearch]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => 
            p.name.toLowerCase().includes(productSearch.toLowerCase())
        );
    }, [products, productSearch]);

    return (
        <div className="max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white rounded-xl shadow-lg">
                            <ShoppingCart size={28} />
                        </div>
                        Point of Sale
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 ml-14">
                        Create new orders and process checkout seamlessly
                    </p>
                </div>

                {/* POS Tips Card */}
                <div className="bg-violet-50/80 border border-violet-100 p-3.5 rounded-2xl hidden lg:flex items-center gap-3 max-w-md shadow-sm">
                    <div className="p-2 bg-violet-100 text-violet-600 rounded-full shrink-0">
                        <Info size={20} />
                    </div>
                    <div className="text-sm text-violet-800">
                        <p className="font-bold mb-0.5 text-violet-900 leading-tight">POS Tips</p>
                        <p className="text-xs leading-snug">
                            Ask for the customer's phone number first. Then scan or search products to build their <span className="font-bold text-fuchsia-700">Digital Receipt</span>!
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side: Selections (7 cols) */}
                <div className="lg:col-span-7 space-y-6 sticky top-24 self-start">
                    
                    {/* Customer Selection Panel */}
                    <div className={`bg-white rounded-3xl shadow-sm border ${selectedCustomer ? 'border-violet-300 ring-2 ring-violet-50' : 'border-gray-100'} p-6 transition-all`}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                <div className={`p-1.5 rounded-lg ${selectedCustomer ? 'bg-violet-100 text-violet-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <User size={18} />
                                </div>
                                Step 1: Select Customer
                            </h3>
                            {selectedCustomer && (
                                <button onClick={() => setSelectedCustomer(null)} className="text-sm px-3 py-1.5 bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg flex items-center gap-1.5 transition-colors font-medium border border-gray-200 hover:border-red-200">
                                    Change <X size={14} />
                                </button>
                            )}
                        </div>

                        {!selectedCustomer ? (
                            <>
                                <div className="relative mb-3">
                                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name or mobile number..."
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-inner transition-all"
                                        value={customerSearch}
                                        onChange={(e) => setCustomerSearch(e.target.value)}
                                    />
                                </div>
                                <div className="max-h-[160px] overflow-y-auto border border-gray-100 rounded-xl bg-white shadow-sm">
                                    {filteredCustomers.length === 0 ? (
                                        <div className="p-6 text-center text-sm text-gray-500 italic">No customers found matching your search.</div>
                                    ) : (
                                        <ul className="divide-y divide-gray-50">
                                            {filteredCustomers.map(c => (
                                                <li 
                                                    key={c.id} 
                                                    onClick={() => setSelectedCustomer(c)}
                                                    className="px-5 py-3.5 hover:bg-violet-50 cursor-pointer flex justify-between items-center transition-colors group"
                                                >
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{c.name}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">{c.mobileNumber || 'No mobile'}</p>
                                                    </div>
                                                    <div className="bg-gray-100 group-hover:bg-violet-200 p-1.5 rounded-full transition-colors">
                                                        <Plus size={16} className="text-gray-400 group-hover:text-violet-700" />
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-100 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white text-lg font-black shadow-md">
                                        {(selectedCustomer?.name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-violet-900 text-lg">{selectedCustomer?.name || 'Unknown Customer'}</p>
                                        <p className="text-xs font-bold text-violet-600/70 mt-0.5 uppercase tracking-wide">{selectedCustomer?.mobileNumber || 'No mobile'}</p>
                                    </div>
                                </div>
                                <CheckCircle size={28} className="text-emerald-500 drop-shadow-sm" />
                            </div>
                        )}
                    </div>

                    {/* Product Selection Panel */}
                    <div className={`bg-white rounded-3xl shadow-sm border ${selectedCustomer ? 'border-gray-100' : 'border-gray-100 opacity-60 pointer-events-none'} p-6 transition-all`}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                <div className={`p-1.5 rounded-lg ${selectedCustomer ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <Package size={18} />
                                </div>
                                Step 2: Add Products
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                            {/* Product List */}
                            <div className="flex flex-col">
                                <div className="relative mb-3">
                                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search inventory..."
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner transition-all"
                                        value={productSearch}
                                        onChange={(e) => setProductSearch(e.target.value)}
                                    />
                                </div>
                                <div className="flex-1 max-h-[300px] overflow-y-auto border border-gray-100 rounded-xl shadow-sm">
                                    {filteredProducts.length === 0 ? (
                                        <div className="p-6 text-center text-sm text-gray-500 italic">No products found</div>
                                    ) : (
                                        <ul className="divide-y divide-gray-50">
                                            {filteredProducts.map(p => {
                                                const inCart = cart.some(item => item.productId === p.id);
                                                const isSelected = selectedProduct?.id === p.id;
                                                return (
                                                    <li 
                                                        key={p.id} 
                                                        onClick={() => !inCart && p.quantity > 0 && setSelectedProduct(p)}
                                                        className={`px-4 py-3 flex justify-between items-center transition-colors 
                                                            ${inCart || p.quantity === 0 ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer hover:bg-blue-50/50'}
                                                            ${isSelected ? 'bg-blue-50 ring-2 ring-blue-500 inset-0 z-10 relative' : ''}
                                                        `}
                                                    >
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900 leading-tight">{p.name}</p>
                                                            <p className={`text-[10px] font-bold uppercase mt-1 ${p.quantity <= 10 && p.quantity > 0 ? 'text-amber-500' : 'text-gray-400'}`}>Stock: {p.quantity}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-black text-gray-700 flex items-center justify-end"><IndianRupee size={12}/>{p.price.toLocaleString()}</p>
                                                            {inCart && <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">In Cart</span>}
                                                            {p.quantity === 0 && !inCart && <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">Out of Stock</span>}
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* Qty Selector */}
                            <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 flex flex-col justify-center items-center shadow-inner">
                                {selectedProduct ? (
                                    <>
                                        <div className="text-center mb-6 w-full">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Selected Product</p>
                                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                                <p className="text-lg font-extrabold text-gray-900 leading-tight">{selectedProduct.name}</p>
                                                <p className="text-xl font-black text-blue-600 mt-1 flex items-center justify-center"><IndianRupee size={18}/>{selectedProduct.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="w-full mb-6">
                                            <label className="block text-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Quantity</label>
                                            <div className="flex items-center justify-center gap-4">
                                                <button 
                                                    type="button"
                                                    onClick={() => setQuantity(Math.max(1, parseInt(quantity || 0) - 1).toString())}
                                                    className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-300 shadow-sm transition-all"
                                                >
                                                    <Minus size={20} />
                                                </button>
                                                <input 
                                                    type="number" 
                                                    className="w-24 text-center text-2xl font-black px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner" 
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(e.target.value)}
                                                    min="1"
                                                    max={selectedProduct.quantity}
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setQuantity(Math.min(selectedProduct.quantity, parseInt(quantity || 0) + 1).toString())}
                                                    className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-300 shadow-sm transition-all"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                            <p className="text-center text-[11px] font-bold text-gray-400 uppercase mt-3 tracking-wide">
                                                Maximum Available: <span className="text-gray-600">{selectedProduct.quantity}</span>
                                            </p>
                                        </div>

                                        <button 
                                            onClick={addToCart} 
                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition shadow-md hover:shadow-lg hover:-translate-y-0.5"
                                        >
                                            <ShoppingCart size={20} /> Add to Receipt
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center text-gray-400 flex flex-col items-center p-6">
                                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <Package size={32} className="opacity-40" />
                                        </div>
                                        <p className="text-sm font-medium">Select a product from the inventory list to configure quantity.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Cart Panel (Digital Receipt) */}
                <div className="lg:col-span-5 sticky top-24 self-start">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 flex flex-col max-h-[calc(100vh-10rem)] min-h-[500px] relative overflow-hidden">
                        
                        {/* Receipt Header */}
                        <div className="p-6 bg-gray-50 border-b-2 border-dashed border-gray-200 relative">
                            {/* Zigzag bottom edge effect using CSS gradients could go here, but a dashed border simulates it well */}
                            <div className="text-center mb-4">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase flex items-center justify-center gap-2">
                                    <FileText size={24} className="text-violet-500" /> Digital Receipt
                                </h3>
                                <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-1">Invoice Preview</p>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                <span className="font-bold text-gray-500">Billed To:</span>
                                {selectedCustomer ? (
                                    <span className="font-black text-violet-700">{selectedCustomer.name}</span>
                                ) : (
                                    <span className="text-gray-400 italic font-medium">No customer selected</span>
                                )}
                            </div>
                        </div>

                        {/* Receipt Items */}
                        <div className="flex-1 p-6 overflow-y-auto bg-white">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-300">
                                    <ShoppingCart size={64} className="mb-4 opacity-20" />
                                    <p className="font-medium text-gray-400">Cart is empty</p>
                                    <p className="text-xs text-gray-300 mt-2">Add items from the left panel</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Table Headers for Receipt */}
                                    <div className="grid grid-cols-12 text-xs font-black text-gray-400 uppercase tracking-wider pb-2 border-b border-gray-100">
                                        <div className="col-span-6">Item</div>
                                        <div className="col-span-2 text-center">Qty</div>
                                        <div className="col-span-4 text-right">Amount</div>
                                    </div>
                                    
                                    <ul className="space-y-3">
                                        {cart.map((item, index) => (
                                            <li key={item.productId} className="group flex flex-col">
                                                <div className="grid grid-cols-12 items-start py-2">
                                                    <div className="col-span-6">
                                                        <p className="font-bold text-gray-900 text-sm leading-tight">{item.name}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">₹{item.price.toLocaleString()} each</p>
                                                    </div>
                                                    <div className="col-span-2 text-center">
                                                        <span className="inline-block bg-gray-100 text-gray-700 font-bold text-xs px-2 py-1 rounded">x{item.quantity}</span>
                                                    </div>
                                                    <div className="col-span-4 text-right flex flex-col items-end">
                                                        <p className="font-black text-gray-900">₹{item.subTotal.toLocaleString()}</p>
                                                        <button 
                                                            onClick={() => removeFromCart(item.productId)}
                                                            className="text-red-400 hover:text-red-600 text-[10px] uppercase font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                                                        >
                                                            <Trash2 size={10} /> Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Checkout Footer */}
                        <div className="p-6 bg-gray-50 border-t-2 border-dashed border-gray-200">
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                                    <span>Subtotal ({cart.length} items)</span>
                                    <span>₹{calculateTotal().toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                                    <span>Tax (Included)</span>
                                    <span>₹0</span>
                                </div>
                                <div className="pt-3 border-t border-gray-200 flex justify-between items-end">
                                    <span className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-1">Total Due</span>
                                    <span className="text-4xl font-black text-gray-900 flex items-center">
                                        <IndianRupee size={28} className="mr-1 text-violet-600" />
                                        {calculateTotal().toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <button 
                                onClick={handleCheckoutClick} 
                                disabled={cart.length === 0 || !selectedCustomer}
                                className={`w-full py-4 rounded-2xl font-black text-lg uppercase tracking-wide flex justify-center items-center gap-2 transition-all shadow-md
                                    ${cart.length > 0 && selectedCustomer 
                                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white hover:shadow-xl hover:-translate-y-1' 
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                                `}
                            >
                                <CreditCard size={22} />
                                {cart.length === 0 ? 'Empty Receipt' : !selectedCustomer ? 'Select Customer' : 'Pay Now'}
                            </button>
                        </div>

                    </div>
                </div>

            </div>

            {/* Payment Modal Overlay (Kept exactly as it was, matches styling already) */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white relative">
                            <button 
                                onClick={() => !isProcessingPayment && setIsPaymentModalOpen(false)}
                                className={`absolute top-4 right-4 text-emerald-200 hover:text-white transition-colors ${isProcessingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isProcessingPayment}
                            >
                                <X size={24} />
                            </button>
                            <h3 className="text-2xl font-bold mb-1">
                                {paymentStep === 'SELECT' ? 'Confirm Payment' : 
                                 paymentStep === 'CASH' ? 'Cash Payment' : 
                                 paymentStep === 'UPI' ? 'UPI Payment' : 'Card Payment'}
                            </h3>
                            <p className="text-emerald-50 text-sm font-medium">
                                {paymentStep === 'SELECT' ? 'Select a payment method to complete the order.' : 'Complete the transaction details below.'}
                            </p>
                        </div>

                        <div className="p-6">
                            {/* Amount Display */}
                            <div className="bg-gray-50 rounded-2xl p-6 text-center mb-6 border border-gray-100 shadow-inner">
                                <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-2">Total Amount Due</p>
                                <p className="text-4xl font-black text-gray-900 flex items-center justify-center">
                                    <IndianRupee size={32} className="mr-1 text-emerald-500" />
                                    {calculateTotal().toLocaleString()}
                                </p>
                            </div>

                            {/* SELECT METHOD VIEW */}
                            {paymentStep === 'SELECT' && (
                                <>
                                    <div className="space-y-3 mb-8">
                                        {[
                                            { id: 'CASH', label: 'Cash Payment', icon: <IndianRupee size={20} />, available: true },
                                            { id: 'UPI', label: 'UPI (GPay, PhonePe, Paytm)', icon: <div className="font-bold text-xs">UPI</div>, available: hasUPI },
                                            { id: 'CARD', label: 'Credit / Debit Card', icon: <CreditCard size={20} />, available: hasBank }
                                        ].map((method) => (
                                            <button
                                                key={method.id}
                                                disabled={!method.available}
                                                onClick={() => setSelectedPaymentMethod(method.id)}
                                                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all relative ${
                                                    !method.available ? 'opacity-60 cursor-not-allowed border-gray-100 bg-gray-50' :
                                                    selectedPaymentMethod === method.id 
                                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-4 ring-emerald-50 shadow-sm' 
                                                        : 'border-gray-100 hover:border-emerald-200 hover:bg-gray-50 text-gray-700'
                                                }`}
                                            >
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${selectedPaymentMethod === method.id ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-500'}`}>
                                                    {method.icon}
                                                </div>
                                                <div className="text-left flex-1">
                                                    <p className={`font-bold ${!method.available ? 'text-gray-400' : ''}`}>{method.label}</p>
                                                    {!method.available && <p className="text-[10px] text-red-500 font-bold uppercase mt-0.5 tracking-wider">Service not available now</p>}
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                    !method.available ? 'border-gray-200 bg-gray-100' :
                                                    selectedPaymentMethod === method.id ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
                                                }`}>
                                                    {selectedPaymentMethod === method.id && method.available && <CheckCircle size={14} className="text-white" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setPaymentStep(selectedPaymentMethod)}
                                        disabled={!selectedPaymentMethod}
                                        className={`w-full py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-md
                                            ${!selectedPaymentMethod 
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                                : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg'}
                                        `}
                                    >
                                        Proceed to Payment
                                    </button>
                                </>
                            )}

                            {/* CASH VIEW */}
                            {paymentStep === 'CASH' && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="text-center mb-8">
                                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <IndianRupee size={40} />
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">Collect Cash</h4>
                                        <p className="text-gray-500 text-sm">Please collect ₹{calculateTotal().toLocaleString()} from the customer.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setPaymentStep('SELECT')} className="px-4 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors border border-transparent hover:border-gray-200">Back</button>
                                        <button onClick={handleConfirmPayment} disabled={isProcessingPayment} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-md flex justify-center items-center gap-2 transition-all">
                                            {isProcessingPayment ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span> : <><CheckCircle size={20}/> Confirm Cash Received</>}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* UPI VIEW */}
                            {paymentStep === 'UPI' && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300 text-center">
                                    <p className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Scan to Pay</p>
                                    <div className="bg-white p-2 border-2 border-dashed border-gray-300 rounded-2xl inline-block mb-6 relative">
                                        {/* Dynamic QR Code embedding the amount */}
                                        <img 
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=store@upi&pn=InventoryStore&am=${calculateTotal()}&cu=INR`} 
                                            alt="UPI QR Code" 
                                            className="w-48 h-48 rounded-xl"
                                        />
                                    </div>
                                    <p className="text-gray-500 text-sm mb-8 px-4 font-medium">Ask the customer to scan this QR code with any UPI app (GPay, PhonePe, Paytm).</p>
                                    <div className="flex gap-3">
                                        <button onClick={() => setPaymentStep('SELECT')} className="px-4 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors">Back</button>
                                        <button onClick={handleConfirmPayment} disabled={isProcessingPayment} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-md flex justify-center items-center gap-2 transition-all">
                                            {isProcessingPayment ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span> : <><CheckCircle size={20}/> Verify Payment Received</>}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* CARD VIEW */}
                            {paymentStep === 'CARD' && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-4 mb-8">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
                                            <div className="relative">
                                                <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono shadow-inner transition-colors" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name on Card</label>
                                            <input type="text" placeholder="JOHN DOE" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner transition-colors" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry</label>
                                                <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center font-mono shadow-inner transition-colors" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVV</label>
                                                <input type="password" placeholder="•••" maxLength="3" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center font-mono tracking-[0.3em] shadow-inner transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setPaymentStep('SELECT')} className="px-4 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors">Back</button>
                                        <button onClick={handleConfirmPayment} disabled={isProcessingPayment} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-md flex justify-center items-center gap-2 transition-all">
                                            {isProcessingPayment ? (
                                                <><span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span> Authorizing Card...</>
                                            ) : (
                                                <><CreditCard size={20}/> Process Payment</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageOrders;
