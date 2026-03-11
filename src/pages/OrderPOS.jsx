import React, { useState, useMemo } from 'react';
import {
    Search,
    Store,
    Trash2,
    Plus,
    Minus,
    ShoppingCart,
    UserCheck,
    Zap,
    Leaf
} from 'lucide-react';

// --- MOCK DATA ---
const mockCustomers = [
    { id: 1, name: 'Cô Ba (Chợ Bến Thành)', phone: '0901234567', type: 'VIP', recommended: [101, 102, 105] },
    { id: 2, name: 'Chú Tư (Q.4)', phone: '0912345678', type: 'Thường xuyên', recommended: [103, 104] },
    { id: 3, name: 'Bếp Cơm Mười Khó', phone: '0987654321', type: 'Sỉ lớn', recommended: [101, 104, 106] },
];

const mockCategories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'cat1', name: 'Rau ăn lá' },
    { id: 'cat2', name: 'Củ quả' },
    { id: 'cat3', name: 'Gia vị' },
];

const mockProducts = [
    { id: 101, name: 'Cải ngọt', price: 15000, unit: 'kg', category: 'cat1', image: '🥬' },
    { id: 102, name: 'Rau muống', price: 12000, unit: 'kg', category: 'cat1', image: '🌿' },
    { id: 103, name: 'Cà chua', price: 25000, unit: 'kg', category: 'cat2', image: '🍅' },
    { id: 104, name: 'Hành tây', price: 18000, unit: 'kg', category: 'cat2', image: '🧅' },
    { id: 105, name: 'Ớt sừng', price: 40000, unit: 'kg', category: 'cat3', image: '🌶️' },
    { id: 106, name: 'Bắp cải', price: 16000, unit: 'kg', category: 'cat1', image: '🥬' },
    { id: 107, name: 'Khoai tây', price: 20000, unit: 'kg', category: 'cat2', image: '🥔' },
    { id: 108, name: 'Tỏi Bắc', price: 65000, unit: 'kg', category: 'cat3', image: '🧄' },
];

export default function OrderPOS() {
    const [searchCustomer, setSearchCustomer] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [searchProduct, setSearchProduct] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const [cart, setCart] = useState([]);

    // Filter Customers
    const filteredCustomers = searchCustomer.trim() === ''
        ? []
        : mockCustomers.filter(c => c.name.toLowerCase().includes(searchCustomer.toLowerCase()) || c.phone.includes(searchCustomer));

    // Select Customer
    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setSearchCustomer('');
    };

    // Recommendations based on Customer
    const recommendedProducts = useMemo(() => {
        if (!selectedCustomer) return [];
        return mockProducts.filter(p => selectedCustomer.recommended.includes(p.id));
    }, [selectedCustomer]);

    // Filter Products
    const filteredProducts = mockProducts.filter(p => {
        const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
        const matchSearch = p.name.toLowerCase().includes(searchProduct.toLowerCase());
        return matchCat && matchSearch;
    });

    // Cart Operations
    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id, newQuantity) => {
        const qty = parseFloat(newQuantity);
        if (isNaN(qty) || qty < 0) return;

        if (qty === 0) {
            setCart(prev => prev.filter(item => item.id !== id));
        } else {
            setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
        }
    };

    const adjustQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    // Calculations
    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        if (!selectedCustomer) {
            alert("Vui lòng chọn khách hàng trước khi chốt đơn!");
            return;
        }
        if (cart.length === 0) {
            alert("Giỏ hàng đang trống!");
            return;
        }
        // Giả lập lưu đơn
        alert(`✅ Đã chốt đơn thành công cho khách hàng: ${selectedCustomer.name}\n💰 Tổng tiền: ${formatCurrency(totalAmount)}`);
        setCart([]);
        setSelectedCustomer(null);
    };

    return (
        <div className="p-4 md:p-6 font-sans pb-24 md:pb-8 flex flex-col h-[calc(100vh-64px)] md:h-screen lg:flex-row gap-6">

            {/* ---------------- CỘT TRÁI: DỮ LIỆU SẢN PHẨM & KHÁCH HÀNG ---------------- */}
            <div className="flex-1 flex flex-col gap-6 lg:w-2/3 h-full overflow-hidden">

                {/* Header Title */}
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                        <Store className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Tạo Đơn Nhanh <span className="text-emerald-400 text-sm font-normal bg-emerald-500/10 px-2 py-0.5 rounded-md ml-2 border border-emerald-500/20">POS</span></h1>
                        <p className="text-slate-400 text-sm">Giao diện bán hàng tối ưu tốc độ trực tại quầy</p>
                    </div>
                </div>

                {/* Section: Chọn Khách Hàng */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex-shrink-0 relative z-20">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-slate-300 font-medium text-sm flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-emerald-400" /> Khách hàng
                        </h2>
                        {selectedCustomer && (
                            <button
                                onClick={() => setSelectedCustomer(null)}
                                className="text-xs text-red-400 hover:text-red-300 transition-colors"
                            >
                                Hủy chọn
                            </button>
                        )}
                    </div>

                    {!selectedCustomer ? (
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="Tìm Tên KH hoặc Số điện thoại..."
                                className="block w-full pl-10 pr-3 py-3 border border-slate-700 bg-slate-950/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                value={searchCustomer}
                                onChange={(e) => setSearchCustomer(e.target.value)}
                            />

                            {/* Dropdown Suggestions */}
                            {filteredCustomers.length > 0 && (
                                <ul className="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden divide-y divide-slate-700/50">
                                    {filteredCustomers.map(c => (
                                        <li
                                            key={c.id}
                                            className="px-4 py-3 hover:bg-slate-700 cursor-pointer transition-colors flex justify-between items-center"
                                            onClick={() => handleSelectCustomer(c)}
                                        >
                                            <div>
                                                <p className="text-emerald-400 font-medium">{c.name}</p>
                                                <p className="text-xs text-slate-400 font-mono">{c.phone}</p>
                                            </div>
                                            <span className="text-xs bg-slate-900 border border-slate-600 px-2 py-1 rounded text-slate-300">{c.type}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-xl p-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/30">
                                    {selectedCustomer.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white leading-none mb-1">{selectedCustomer.name}</h3>
                                    <p className="text-xs text-emerald-400 font-mono">{selectedCustomer.phone}</p>
                                </div>
                            </div>
                            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md border border-emerald-500/20 font-medium">
                                {selectedCustomer.type}
                            </span>
                        </div>
                    )}
                </div>

                {/* Mặc hàng gợi ý (Smart Recommendation) */}
                {selectedCustomer && recommendedProducts.length > 0 && (
                    <div className="flex-shrink-0">
                        <h3 className="text-sm font-medium text-amber-400 flex items-center gap-2 mb-3">
                            <Zap className="w-4 h-4 fill-amber-400" />
                            Món {selectedCustomer.name.split(' ')[0]} thường lấy
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {recommendedProducts.map(product => (
                                <button
                                    key={`rec-${product.id}`}
                                    onClick={() => addToCart(product)}
                                    className="bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-400 border rounded-xl p-3 text-left transition-all group flex flex-col justify-between h-full min-h-[100px]"
                                >
                                    <div className="flex justify-between items-start w-full">
                                        <span className="text-2xl group-hover:scale-110 transition-transform origin-bottom-left">{product.image}</span>
                                        <span className="bg-slate-900/50 text-slate-300 text-[10px] px-1.5 py-0.5 rounded border border-slate-700 font-medium">{product.unit}</span>
                                    </div>
                                    <div className="mt-2 text-sm text-slate-200 font-medium group-hover:text-amber-400 line-clamp-1">{product.name}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Section: Danh mục & Danh sách Sản phẩm */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm flex flex-col flex-1 overflow-hidden min-h-[300px]">

                    {/* Header & Search */}
                    <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/50">
                        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto no-scrollbar">
                            {mockCategories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${selectedCategory === cat.id
                                            ? 'bg-emerald-500 text-white shadow-sm'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full sm:w-64 flex-shrink-0">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="Tìm mặt hàng..."
                                className="block w-full pl-9 pr-3 py-2 border border-slate-700 bg-slate-950 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 text-sm transition-colors"
                                value={searchProduct}
                                onChange={(e) => setSearchProduct(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="p-4 overflow-y-auto flex-1">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                            {filteredProducts.map(product => (
                                <div
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 rounded-2xl p-4 cursor-pointer transition-all group flex flex-col"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="text-4xl group-hover:scale-110 transition-transform origin-bottom-left dropdown-shadow">{product.image}</div>
                                        <span className="bg-slate-900 text-slate-400 text-xs px-2 py-1 rounded border border-slate-800">{product.unit}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-slate-200 font-medium mb-1 group-hover:text-emerald-400 transition-colors uppercase text-sm tracking-wide">{product.name}</h4>
                                        <p className="text-emerald-400 font-bold text-sm bg-emerald-500/5 w-max px-2 py-0.5 rounded font-mono">
                                            {product.price.toLocaleString('vi-VN')}đ /{product.unit}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {filteredProducts.length === 0 && (
                                <div className="col-span-full py-10 flex flex-col items-center justify-center text-slate-500">
                                    <Leaf className="w-12 h-12 mb-3 opacity-20" />
                                    <p>Không tìm thấy sản phẩm nào</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* ---------------- CỘT PHẢI: BILL (GIỎ HÀNG) ---------------- */}
            <div className="lg:w-1/3 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col h-full overflow-hidden flex-shrink-0 relative">

                {/* Bill Header */}
                <div className="p-5 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm z-10 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-emerald-400" />
                        Chi tiết Phiếu
                    </h2>
                    <span className="bg-slate-800 text-slate-300 text-xs py-1 px-3 rounded-full border border-slate-700 font-medium">
                        {cart.length} món
                    </span>
                </div>

                {/* Bill Current Customer Indicator */}
                {selectedCustomer && (
                    <div className="bg-emerald-500/5 border-b border-emerald-500/10 px-5 py-2 flex justify-between items-center">
                        <span className="text-xs text-slate-400">Đang chọn đơn cho:</span>
                        <span className="text-xs font-bold text-emerald-400 truncate max-w-[150px]">{selectedCustomer.name}</span>
                    </div>
                )}

                {/* Bill Items List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col justify-center items-center text-slate-500 italic px-4 text-center">
                            <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
                            Chưa có món nào được chọn. Hãy bấm vào sản phẩm bên trái để thêm vào phiếu.
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={`cart-${item.id}`} className="bg-slate-950 border border-slate-800 p-3 rounded-2xl group flex flex-col gap-3 relative overflow-hidden transition-colors hover:border-slate-700">
                                {/* Item Info row */}
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-2">
                                        <span className="text-xl leading-none pt-0.5">{item.image}</span>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-200 leading-tight">{item.name}</h4>
                                            <div className="text-xs text-slate-500 mt-1">{item.price.toLocaleString('vi-VN')} đ/{item.unit}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-slate-600 hover:text-red-400 p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* SL & Total cost row */}
                                <div className="flex justify-between items-center border-t border-slate-800 pt-3">
                                    <div className="flex items-center gap-1 bg-slate-900 rounded-lg border border-slate-700 p-1">
                                        <button
                                            onClick={() => adjustQuantity(item.id, -1)}
                                            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>

                                        {/* Ô gõ số lượng (cho phép số lẻ vì mua theo cân) */}
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, e.target.value)}
                                            step="0.1"
                                            min="0"
                                            className="w-12 text-center bg-transparent border-none text-slate-200 text-sm font-bold focus:outline-none focus:ring-0 p-0 hide-arrows"
                                        />
                                        <span className="text-xs text-slate-500 pr-1 select-none">{item.unit}</span>

                                        <button
                                            onClick={() => adjustQuantity(item.id, 1)}
                                            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>

                                    <div className="text-sm font-bold text-emerald-400">
                                        {formatCurrency(item.price * item.quantity)}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Bill Footer (Totals & Checkout) */}
                <div className="border-t border-slate-800 bg-slate-950 p-5 mt-auto relative z-10">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-400 text-sm">Tổng cộng</span>
                        <span className="text-slate-500 font-medium text-sm">{cart.reduce((s, i) => s + i.quantity, 0)} mục</span>
                    </div>
                    <div className="flex justify-between items-end mb-5">
                        <span className="text-slate-200 font-medium">Thành tiền / Công nợ</span>
                        <span className="text-3xl font-bold text-emerald-400 tracking-tight">
                            {formatCurrency(totalAmount)}
                        </span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-base font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-wide"
                    >
                        Chốt Đơn & Lưu
                    </button>
                </div>

            </div>
        </div>
    );
}
