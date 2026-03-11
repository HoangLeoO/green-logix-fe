import React, { useState } from 'react';
import {
    Search,
    ShoppingCart,
    Plus,
    Minus,
    Leaf,
    Star,
    CheckCircle2,
    Trash2
} from 'lucide-react';

const favoriteProducts = [
    { id: '101', name: 'Cải ngọt', price: 15000, unit: 'kg', image: '🥬' },
    { id: '104', name: 'Hành tây', price: 18000, unit: 'kg', image: '🧅' },
    { id: '106', name: 'Bắp cải', price: 16000, unit: 'kg', image: '🥬' },
];

const mockProducts = [
    { id: '101', name: 'Cải ngọt', price: 15000, unit: 'kg', category: 'Rau ăn lá', image: '🥬' },
    { id: '102', name: 'Rau muống', price: 12000, unit: 'kg', category: 'Rau ăn lá', image: '🌿' },
    { id: '103', name: 'Cà chua', price: 25000, unit: 'kg', category: 'Củ quả', image: '🍅' },
    { id: '104', name: 'Hành tây', price: 18000, unit: 'kg', category: 'Củ quả', image: '🧅' },
    { id: '105', name: 'Ớt sừng', price: 40000, unit: 'kg', category: 'Gia vị', image: '🌶️' },
    { id: '106', name: 'Bắp cải', price: 16000, unit: 'kg', category: 'Rau ăn lá', image: '🥬' },
    { id: '107', name: 'Khoai tây', price: 20000, unit: 'kg', category: 'Củ quả', image: '🥔' },
    { id: '108', name: 'Tỏi Bắc', price: 65000, unit: 'kg', category: 'Gia vị', image: '🧄' },
];

export default function Shop() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false); // Mobile cart overlay

    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    // Lọc sản phẩm
    const filteredProducts = mockProducts.filter(p => {
        const matchCat = selectedCategory === 'all' || p.category.includes(selectedCategory);
        const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCat && matchSearch;
    });

    // Giỏ hàng
    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const updateQuantityDirectly = (id, val) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: parseFloat(val) || 0 };
            }
            return item;
        }));
    }

    const handleCheckout = () => {
        if (cart.length === 0) return;
        alert('Đơn hàng của bạn đã được gửi thành công đến nhà cung cấp!');
        setCart([]);
        setShowCart(false);
    };

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-56px)] md:h-screen w-full relative">

            {/* AREA 1: MENU SẢN PHẨM */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-32 lg:pb-6 relative no-scrollbar bg-slate-950">

                {/* Banner/Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-6 mb-6 shadow-lg shadow-emerald-500/10 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-2xl font-bold mb-1">Cửa Hàng Xanh</h1>
                        <p className="text-emerald-100 text-sm">Rau xanh, củ quả sạch mỗi ngày cho nhà hàng của bạn.</p>
                    </div>
                    <Leaf className="absolute -right-6 -bottom-6 w-32 h-32 opacity-20 text-white transform -rotate-12" />
                </div>

                {/* Món thường gọi */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2 mb-4">
                        <Star className="w-5 h-5 fill-amber-400" />
                        Thường Lấy Gần Đây
                    </h2>
                    <div className="flex overflow-x-auto gap-4 no-scrollbar pb-2">
                        {favoriteProducts.map(fp => (
                            <div key={`fav-${fp.id}`} className="min-w-[140px] bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between shadow-sm relative group">
                                <div className="absolute top-2 right-2 text-3xl group-hover:scale-110 transition-transform origin-bottom-right">{fp.image}</div>
                                <div className="text-[11px] font-bold text-slate-500 mb-6 bg-slate-800 self-start px-2 py-0.5 rounded uppercase tracking-wider">HOT</div>
                                <div>
                                    <h3 className="text-white font-medium text-sm line-clamp-1">{fp.name}</h3>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-emerald-400 font-bold text-sm tracking-wide">{fp.price.toLocaleString()}đ</span>
                                        <button onClick={() => addToCart(fp)} className="w-7 h-7 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg flex items-center justify-center transition-colors shadow">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Danh mục & Tìm kiếm */}
                <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur-md pt-2 pb-4 border-b border-slate-800/80 mb-6">
                    <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 mb-4 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
                        <Search className="w-5 h-5 text-slate-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Tìm theo tên sản phẩm..."
                            className="bg-transparent border-none outline-none text-slate-200 w-full placeholder-slate-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {['all', 'Rau ăn lá', 'Củ quả', 'Gia vị'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'}`}
                            >
                                {cat === 'all' ? 'Tất cả' : cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Danh sách All Products (Lưới thẻ dọc siêu Mobile-Friendly) */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                    {filteredProducts.map(p => {
                        const inCart = cart.find(i => i.id === p.id);
                        return (
                            <div key={`prod-${p.id}`} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-500/50 transition-colors group">
                                <div className="w-full flex justify-center mb-3 group-hover:-translate-y-1 transition-transform">
                                    <span className="text-5xl drop-shadow-lg">{p.image}</span>
                                </div>
                                <div className="text-center mb-3">
                                    <h4 className="text-slate-200 font-bold text-[15px] mb-1 leading-tight">{p.name}</h4>
                                    <p className="text-emerald-400 font-bold text-sm tracking-wide bg-emerald-500/10 inline-block px-2 py-0.5 rounded border border-emerald-500/10">
                                        {p.price.toLocaleString()}đ<span className="text-[10px] text-slate-400">/{p.unit}</span>
                                    </p>
                                </div>

                                {inCart ? (
                                    <div className="flex items-center justify-between bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-1">
                                        <button onClick={() => updateQuantity(p.id, -1)} className="w-8 h-8 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 rounded-lg">
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-bold text-white text-sm w-8 text-center">{inCart.quantity}</span>
                                        <button onClick={() => updateQuantity(p.id, 1)} className="w-8 h-8 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 rounded-lg">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => addToCart(p)}
                                        className="w-full bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white font-medium py-2 rounded-xl border border-slate-700 hover:border-emerald-500 transition-all flex justify-center items-center gap-2 text-sm"
                                    >
                                        Thêm <Plus className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* AREA 2: GIỎ HÀNG (Sidebar Desktop / Bottom Sheet Mobile) */}

            {/* Dim Overlay Mobile */}
            {showCart && (
                <div className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setShowCart(false)}></div>
            )}

            <div className={`
        fixed lg:static right-0 bottom-0 top-0 w-full lg:w-96 
        bg-slate-900 border-l border-slate-800 shadow-2xl z-50 
        flex flex-col transform transition-transform duration-300 ease-in-out
        ${showCart ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
      `}>
                {/* Cart Header */}
                <div className="p-4 md:p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/95 sticky top-0 z-20">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <ShoppingCart className="w-6 h-6 text-emerald-400" />
                        Giỏ hàng của bạn
                    </h2>
                    <button className="lg:hidden text-slate-400 font-bold bg-slate-800 px-3 py-1.5 rounded-lg text-sm" onClick={() => setShowCart(false)}>Đóng</button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 no-scrollbar">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
                            <ShoppingCart className="w-16 h-16 mb-4 opacity-50 block" />
                            <p className="font-medium text-center">Chưa có gì trong giỏ hàng</p>
                            <p className="text-xs text-center mt-1">Chọn từ danh sách để lên hóa đơn.</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={`cart-${item.id}`} className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                                <div className="text-3xl bg-slate-900 w-14 h-14 rounded-xl flex items-center justify-center border border-slate-800 shadow-inner">
                                    {item.image}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-bold text-sm mb-1">{item.name}</h4>
                                    <span className="text-emerald-400 font-bold text-xs">{(item.price).toLocaleString()}đ/{item.unit}</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5 bg-slate-900 px-1 py-1 rounded-lg border border-slate-800">
                                    <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 text-emerald-400 hover:bg-slate-700 rounded-md flex justify-center items-center"><Plus className="w-3 h-3" /></button>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantityDirectly(item.id, e.target.value)}
                                        className="w-8 text-center text-sm font-bold text-white bg-transparent outline-none hide-arrows"
                                    />
                                    <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 text-slate-400 hover:bg-slate-700 hover:text-white rounded-md flex justify-center items-center"><Minus className="w-3 h-3" /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Cart Footer */}
                <div className="p-5 md:p-6 bg-slate-950 border-t border-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-20">
                    <div className="flex justify-between items-center mb-5">
                        <span className="text-slate-400 font-medium">Tổng tạ/số lượng:</span>
                        <span className="text-white font-bold bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">{totalItems} món</span>
                    </div>

                    <div className="flex justify-between items-end mb-6">
                        <span className="text-slate-200 text-lg font-bold">Thành tiền:</span>
                        <span className="text-3xl font-bold text-emerald-400 tracking-tight">
                            {formatCurrency(totalAmount)}
                        </span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white uppercase tracking-widest font-bold py-4 rounded-xl flex justify-center items-center gap-2 shadow-xl shadow-emerald-500/20 transition-all border border-emerald-500/50"
                    >
                        Gửi Đơn Hàng <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <p className="text-xs text-center text-slate-500 mt-3 flex items-center justify-center gap-1.5">
                        <Leaf className="w-3 h-3" /> Cam kết giao sớm nhất trong ngày
                    </p>
                </div>
            </div>

            {/* Nút Xem Giỏ Hàng cho Mobile (Chỉ hiện khi giỏ bị ẩn) */}
            {!showCart && (
                <div className="lg:hidden absolute bottom-6 right-4 left-4 z-30">
                    <button
                        onClick={() => setShowCart(true)}
                        className="w-full bg-slate-900 border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/30 text-white p-4 rounded-2xl font-bold flex justify-between items-center group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors"></div>
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="relative">
                                <ShoppingCart className="w-6 h-6 text-emerald-400" />
                                {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border border-slate-900">{cart.length}</span>}
                            </div>
                            <span>Xem Giỏ Hàng</span>
                        </div>
                        <span className="text-emerald-400 relative z-10">{formatCurrency(totalAmount)}</span>
                    </button>
                </div>
            )}

        </div>
    );
}
