import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    Search, Store, Trash2, Plus, Minus, ShoppingCart,
    UserCheck, Zap, Leaf, Loader2, X, ClipboardList, ChevronDown
} from 'lucide-react';
import { useConfirmStore } from '../../../store/useConfirmStore';
import { toast } from 'sonner';
import { productApi } from '../../../api/services/product';
import { customerApi } from '../../../api/services/customer';
import { categoryApi } from '../../../api/services/category';
import { orderApi } from '../../../api/services/order';
import { useDebounce } from '../../../hooks/useDebounce';



const formatCurrency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v || 0);

export default function OrderPOS() {
    const { showConfirm } = useConfirmStore();
    const customerDropdownRef = useRef(null);

    // ───────────────── STATE ─────────────────
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null); // null = tất cả
    const [searchProduct, setSearchProduct] = useState('');
    const debouncedSearch = useDebounce(searchProduct, 300);

    const [customers, setCustomers] = useState([]);
    const [searchCustomer, setSearchCustomer] = useState('');
    const debouncedCustomer = useDebounce(searchCustomer, 300);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(null); // chi nhánh đã chọn
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

    const [cart, setCart] = useState([]);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [favorites, setFavorites] = useState([]);
    const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);

    // ───────────────── FETCH ─────────────────
    // Load danh mục
    useEffect(() => {
        categoryApi.getAll().then(data => {
            const list = Array.isArray(data) ? data : (data?.content || []);
            setCategories(list);
        }).catch(() => { });
    }, []);

    // Load sản phẩm
    const fetchProducts = useCallback(async (showLoading = true) => {
        if (showLoading) setIsLoadingProducts(true);
        try {
            const data = await productApi.getAll({
                search: debouncedSearch || '',
                categoryId: selectedCategory || '',
                size: 50,
                sort: 'name,asc',
            });
            const list = data?.content || (Array.isArray(data) ? data : []);
            setProducts(list.filter(p => p.isActive !== false));
        } catch {
            toast.error('Không tải được danh sách sản phẩm!');
        } finally {
            if (showLoading) setIsLoadingProducts(false);
        }
    }, [debouncedSearch, selectedCategory]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    // Tìm kiếm khách hàng
    const fetchCustomers = useCallback(async () => {
        setIsLoadingCustomers(true);
        try {
            const data = await customerApi.getAll({ search: debouncedCustomer, size: 20 });
            setCustomers(data?.content || []);
        } catch { } finally {
            setIsLoadingCustomers(false);
        }
    }, [debouncedCustomer]);

    useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

    // Load món ưa thích (khách hàng thường mua)
    useEffect(() => {
        if (!selectedCustomer) {
            setFavorites([]);
            return;
        }
        const fetchFavs = async () => {
            setIsLoadingFavorites(true);
            try {
                const data = await customerApi.getFavorites(selectedCustomer.id);
                setFavorites(data || []);
            } catch (err) {
                console.error("Lỗi tải món ưa thích", err);
            } finally {
                setIsLoadingFavorites(false);
            }
        };
        fetchFavs();
    }, [selectedCustomer]);

    // Đóng dropdown khi click ngoài
    useEffect(() => {
        const handler = (e) => {
            if (customerDropdownRef.current && !customerDropdownRef.current.contains(e.target)) {
                setShowCustomerDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // ───────────────── CART ─────────────────
    const addToCart = (product) => {
        const stock = parseFloat(product.stockQuantity) || 0;
        if (stock <= 0) {
            toast.error(`"${product.name}" đã hết hàng!`);
            return;
        }
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                const newQty = Math.round((existing.quantity + 1) * 10) / 10;
                if (newQty > stock) {
                    toast.warning(`"${product.name}" chỉ còn ${stock} ${product.unit} trong kho!`);
                    return prev;
                }
                return prev.map(i => i.id === product.id ? { ...i, quantity: newQty } : i);
            }
            return [...prev, {
                id: product.id,
                name: product.name,
                unit: product.unit,
                price: parseFloat(product.defaultPrice) || 0,
                sku: product.sku,
                stock: stock,
                categoryName: product.category?.name || '',
                quantity: 1,
            }];
        });
    };

    const addFavoriteToCart = (fav) => {
        const stock = parseFloat(fav.stockQuantity) || 0;
        if (stock <= 0) {
            toast.error(`"${fav.productName}" đã hết hàng!`);
            return;
        }
        const qtyToAdd = parseFloat(fav.defaultQuantity) || 1;

        setCart(prev => {
            const existing = prev.find(i => i.id === fav.productId);
            if (existing) {
                const newQty = Math.round((existing.quantity + qtyToAdd) * 10) / 10;
                if (newQty > stock) {
                    toast.warning(`"${fav.productName}" chỉ còn ${stock} ${fav.productUnit} trong kho! Đã lấy tối đa.`);
                    return prev.map(i => i.id === fav.productId ? { ...i, quantity: stock } : i);
                }
                return prev.map(i => i.id === fav.productId ? { ...i, quantity: newQty } : i);
            }
            const clampedQty = Math.min(qtyToAdd, stock);
            if (clampedQty < qtyToAdd) toast.warning(`"${fav.productName}" chỉ còn ${stock} ${fav.productUnit} trong kho!`);

            return [...prev, {
                id: fav.productId,
                name: fav.productName,
                unit: fav.productUnit,
                price: parseFloat(fav.currentPrice) || 0,
                stock: stock,
                quantity: clampedQty,
            }];
        });
    };

    const updateQuantity = (id, val) => {
        const qty = parseFloat(val);
        if (isNaN(qty) || qty < 0) return;
        if (qty === 0) setCart(prev => prev.filter(i => i.id !== id));
        else setCart(prev => prev.map(i => {
            if (i.id !== id) return i;
            if (qty > i.stock) {
                toast.warning(`Chỉ còn ${i.stock} ${i.unit} trong kho!`);
                return { ...i, quantity: i.stock };
            }
            return { ...i, quantity: qty };
        }));
    };

    const adjustQty = (id, delta) => {
        setCart(prev => prev.map(i => {
            if (i.id !== id) return i;
            const q = Math.round((i.quantity + delta) * 10) / 10;
            const clamped = Math.max(0.1, Math.min(q, i.stock));
            if (q > i.stock) toast.warning(`Chỉ còn ${i.stock} ${i.unit} trong kho!`);
            return { ...i, quantity: clamped };
        }));
    };

    const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
    const clearCart = () => {
        showConfirm({
            title: 'Xóa toàn bộ giỏ hàng?',
            message: 'Tất cả sản phẩm trong phiếu sẽ bị xóa.',
            confirmText: 'Xóa giỏ hàng',
            type: 'danger',
            onConfirm: () => { setCart([]); setNotes(''); }
        });
    };

    const totalAmount = useMemo(() => cart.reduce((s, i) => s + (i.price * i.quantity), 0), [cart]);
    const totalItems = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);

    // ───────────────── CHECKOUT ─────────────────
    const handleCheckout = () => {
        if (!selectedCustomer) { toast.warning('Vui lòng chọn khách hàng!'); return; }
        if (selectedCustomer.status !== 'approved') {
            toast.error(`Khách hàng "${selectedCustomer.name}" đang chờ duyệt hoặc bị khóa. Không thể tạo đơn!`);
            return;
        }
        if (cart.length === 0) { toast.warning('Giỏ hàng đang trống!'); return; }

        showConfirm({
            title: 'Xác nhận chốt đơn',
            message: `Lưu đơn hàng cho khách "${selectedCustomer.name}" — Tổng ${formatCurrency(totalAmount)}?`,
            confirmText: 'Chốt Đơn',
            type: 'success',
            onConfirm: async () => {
                setIsSubmitting(true);
                try {
                    const payload = {
                        customerId: selectedCustomer.id,
                        branchId: selectedBranch ? selectedBranch.id : null,
                        notes: notes,
                        items: cart.map(i => ({
                            productId: i.id,
                            quantity: i.quantity,
                            unitPrice: i.price,
                        })),
                    };
                    const created = await orderApi.create(payload);
                    toast.success(`Đã chốt đơn ${created.orderCode} thành công!`);
                    setCart([]);
                    setNotes('');
                    setSelectedCustomer(null);
                    setSelectedBranch(null);
                    // Cập nhật tồn kho sản phẩm sau khi chốt đơn (silent, không loading)
                    fetchProducts(false);
                } catch (err) {
                    toast.error(err?.response?.data?.message || 'Có lỗi khi lưu đơn hàng!');
                } finally {
                    setIsSubmitting(false);
                }
            }
        });
    };

    // ───────────────── RENDER ─────────────────
    return (
        <div className="p-4 md:p-6 font-sans pb-24 md:pb-8 flex flex-col lg:flex-row gap-5 h-[calc(100vh-56px)] overflow-hidden">

            {/* ════════ CỘT TRÁI (Cuộn toàn trang) ════════ */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 md:pr-2 min-w-0 flex flex-col gap-4 pb-4">

                {/* Header */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                        <Store className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">
                            Tạo Đơn Nhanh
                            <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md ml-2 border border-emerald-500/20 uppercase tracking-widest">POS</span>
                        </h1>
                        <p className="text-slate-500 text-xs">Bán hàng tối ưu tốc độ trực tại quầy</p>
                    </div>
                </div>

                {/* Chọn khách hàng */}
                <div ref={customerDropdownRef} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex-shrink-0 relative z-50">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-emerald-400" /> Khách hàng
                        </h2>
                        {selectedCustomer && (
                            <button onClick={() => { setSelectedCustomer(null); setSelectedBranch(null); }} className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1">
                                <X className="w-3 h-3" /> Đổi khách
                            </button>
                        )}
                    </div>

                    {!selectedCustomer ? (
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                {isLoadingCustomers ? <Loader2 className="h-4 w-4 text-slate-500 animate-spin" /> : <Search className="h-4 w-4 text-slate-500" />}
                            </div>
                            <input
                                type="text"
                                placeholder="Tìm tên hoặc số điện thoại khách hàng..."
                                className="block w-full pl-10 pr-3 py-3 border border-slate-700 bg-slate-950/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors text-sm"
                                value={searchCustomer}
                                onChange={e => { setSearchCustomer(e.target.value); }}
                                onFocus={() => setShowCustomerDropdown(true)}
                                onClick={() => setShowCustomerDropdown(true)}
                            />
                            {showCustomerDropdown && customers.length > 0 && (
                                <ul className="absolute z-40 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden divide-y divide-slate-700/50 max-h-56 overflow-y-auto">
                                    {customers.map(c => (
                                        <li
                                            key={c.id}
                                            className={`px-4 py-3 cursor-pointer transition-colors flex justify-between items-center ${c.status === 'approved' ? 'hover:bg-slate-700' : 'bg-slate-900/50 opacity-60 cursor-not-allowed'}`}
                                            onMouseDown={() => {
                                                if (c.status !== 'approved') {
                                                    toast.error(`Khách hàng "${c.name}" đang chờ duyệt. Vui lòng phê duyệt trước khi tạo đơn!`);
                                                    return;
                                                }
                                                setSelectedCustomer(c); setSelectedBranch(null); setSearchCustomer(''); setShowCustomerDropdown(false);
                                            }}
                                        >
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-white font-bold text-sm">{c.name}</p>
                                                    {c.status === 'pending' && <span className="text-[8px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/20 font-bold uppercase tracking-widest">Chờ duyệt</span>}
                                                    {c.status === 'rejected' && <span className="text-[8px] bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded border border-red-500/20 font-bold uppercase tracking-widest">Từ chối</span>}
                                                </div>
                                                <p className="text-xs text-emerald-400 font-mono">{c.phone}</p>
                                            </div>
                                            <span className="text-[10px] bg-slate-900 border border-slate-600 px-2 py-1 rounded font-mono text-slate-400">{c.customerCode}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-xl">
                                <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black border border-emerald-500/30 text-sm flex-shrink-0">
                                    {selectedCustomer.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-white leading-none truncate">{selectedCustomer.name}</h3>
                                    <p className="text-xs text-emerald-400 font-mono mt-0.5">{selectedCustomer.phone} · {selectedCustomer.customerCode}</p>
                                </div>
                                <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                            </div>

                            {/* Dropdown chọn chi nhánh (nếu có) */}
                            {selectedCustomer.branches && selectedCustomer.branches.length > 0 && (
                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3">
                                    <label className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Store className="w-3.5 h-3.5" /> Chọn điểm giao hàng
                                    </label>
                                    <select
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-emerald-400 font-medium focus:outline-none focus:border-emerald-500 custom-scrollbar"
                                        value={selectedBranch ? selectedBranch.id : ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setSelectedBranch(val ? selectedCustomer.branches.find(b => b.id.toString() === val) : null);
                                        }}
                                    >
                                        <option value="">Trụ sở chính: {selectedCustomer.address || 'Không ghi rõ'}</option>
                                        {selectedCustomer.branches.map(b => (
                                            <option key={b.id} value={b.id}>
                                                CN: {b.branchName} ({b.address || b.phone || 'Chưa định vị'})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                        </div>
                    )}
                </div>

                {/* Category tabs + Search */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col min-h-[600px]">
                    <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md px-4 pt-4 pb-0 border-b border-slate-800 flex flex-col gap-3 rounded-t-2xl shadow-sm">
                        {/* Category Tabs (scrollable) */}
                        <div className="flex gap-1.5 overflow-x-auto pb-3 no-scrollbar">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-4 py-1.5 text-sm font-bold rounded-lg whitespace-nowrap transition-all border flex-shrink-0 ${!selectedCategory
                                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30'
                                    : 'text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'}`}
                            >
                                Tất cả
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-4 py-1.5 text-sm font-bold rounded-lg whitespace-nowrap transition-all border flex-shrink-0 ${selectedCategory === cat.id
                                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30'
                                        : 'text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative pb-3">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="Tìm mặt hàng..."
                                className="block w-full pl-9 pr-8 py-2 border border-slate-700 bg-slate-950 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 text-sm transition-colors"
                                value={searchProduct}
                                onChange={e => setSearchProduct(e.target.value)}
                            />
                            {searchProduct && (
                                <button onClick={() => setSearchProduct('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Product grid */}
                    <div className="p-4 flex flex-col flex-1">

                        {/* Món Thường Mua */}
                        {selectedCustomer && favorites.length > 0 && (
                            <div className="mb-5 animate-in fade-in slide-in-from-top-2">
                                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-emerald-400" /> <span className="text-slate-300">Khách hay mua</span>
                                </h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {favorites.map(fav => (
                                        <button
                                            key={fav.id}
                                            onClick={() => addFavoriteToCart(fav)}
                                            disabled={parseFloat(fav.stockQuantity) <= 0}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all shadow-sm group active:scale-95 ${parseFloat(fav.stockQuantity) <= 0
                                                ? 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed'
                                                : 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 text-slate-200'
                                                }`}
                                        >
                                            <span className="font-medium">{fav.productName}</span>
                                            <div className="flex items-center gap-1.5 pl-2.5 border-l border-emerald-500/30">
                                                <span className="font-black text-emerald-400 font-mono tracking-tight">{fav.defaultQuantity}{fav.productUnit}</span>
                                                <Plus className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-125 transition-transform" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isLoadingProducts ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                            </div>
                        ) : products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-500 opacity-40">
                                <Leaf className="w-12 h-12 mb-3" />
                                <p className="text-sm">Không tìm thấy sản phẩm</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                                {products.map(product => {
                                    const inCart = cart.find(i => i.id === product.id);
                                    return (
                                        <button
                                            key={product.id}
                                            onClick={() => addToCart(product)}
                                            disabled={parseFloat(product.stockQuantity) <= 0}
                                            className={`relative bg-slate-950 border rounded-2xl p-4 text-left transition-all group flex flex-col min-h-[100px] active:scale-95
                                                ${parseFloat(product.stockQuantity) <= 0
                                                    ? 'border-slate-800/50 opacity-50 cursor-not-allowed'
                                                    : inCart
                                                        ? 'border-emerald-500/50 bg-emerald-500/5 shadow-md shadow-emerald-500/10'
                                                        : 'border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900'
                                                }`}
                                        >
                                            {inCart && (
                                                <span className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow">
                                                    {inCart.quantity}
                                                </span>
                                            )}
                                            {parseFloat(product.stockQuantity) <= 0 && (
                                                <span className="absolute top-2 left-2 text-[9px] bg-red-500/20 text-red-400 border border-red-500/20 rounded px-1.5 py-0.5 font-bold">Hết</span>
                                            )}
                                            <div className="mt-auto">
                                                <h4 className={`font-bold text-sm leading-tight mb-1.5 line-clamp-1 ${inCart ? 'text-emerald-400' : 'text-slate-200 group-hover:text-emerald-400'
                                                    } transition-colors`}>
                                                    {product.name}
                                                </h4>
                                                <div className="flex items-center justify-between gap-1 mb-1">
                                                    <span className="text-emerald-400 font-black text-sm font-mono">
                                                        {Number(product.defaultPrice).toLocaleString('vi-VN')}đ
                                                    </span>
                                                    <span className="text-[10px] text-slate-500 bg-slate-900 border border-slate-700 px-1.5 rounded">
                                                        /{product.unit}
                                                    </span>
                                                </div>
                                                <div className={`text-[10px] font-bold ${parseFloat(product.stockQuantity) <= 5
                                                    ? 'text-red-400'
                                                    : 'text-slate-500'
                                                    } flex items-center gap-1`}>
                                                    <span>Còn:</span>
                                                    <span className={`font-mono ${parseFloat(product.stockQuantity) <= 5 ? 'text-red-400' : 'text-slate-400'
                                                        }`}>{product.stockQuantity} {product.unit}</span>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ════════ CỘT PHẢI: BILL ════════ */}
            <div className="lg:w-[340px] xl:w-[380px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden flex-shrink-0 relative">

                {/* Header */}
                <div className="p-5 border-b border-slate-800 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-emerald-400" />
                        Phiếu Bán
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="bg-emerald-500/10 text-emerald-400 text-xs font-black py-1 px-3 rounded-full border border-emerald-500/20">
                            {cart.length} SP
                        </span>
                        {cart.length > 0 && (
                            <button onClick={clearCart} className="text-slate-500 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-all" title="Xóa giỏ hàng">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Customer indicator */}
                {selectedCustomer && (
                    <div className="bg-emerald-500/5 border-b border-emerald-500/10 px-5 py-3 flex flex-col gap-1 flex-shrink-0">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Khách:</span>
                            <span className="font-black text-emerald-400 truncate max-w-[180px]">{selectedCustomer.name}</span>
                        </div>
                        {selectedBranch && (
                            <div className="flex justify-between items-center text-[11px]">
                                <span className="text-slate-600 font-bold uppercase tracking-wider">Giao đến:</span>
                                <span className="text-slate-400 font-medium italic truncate max-w-[150px]">{selectedBranch.branchName}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Items list */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col justify-center items-center text-slate-600 text-center px-4 py-10">
                            <ShoppingCart className="w-12 h-12 mb-4 opacity-30" />
                            <p className="text-sm italic">Chưa có món nào. Chọn sản phẩm ở bên trái để bắt đầu.</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={`cart-${item.id}`} className="bg-slate-950 border border-slate-800 p-3 rounded-2xl group hover:border-slate-700 transition-colors">
                                <div className="flex justify-between items-start mb-2.5">
                                    <div className="flex-1 min-w-0 pr-2">
                                        <h4 className="text-sm font-bold text-slate-200 leading-tight line-clamp-1">{item.name}</h4>
                                        <p className="text-[11px] text-slate-500 mt-0.5 font-mono">{Number(item.price).toLocaleString('vi-VN')}đ/{item.unit}</p>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-slate-600 hover:text-red-400 p-1 flex-shrink-0 transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center bg-slate-900 rounded-lg border border-slate-700 p-0.5">
                                        <button onClick={() => adjustQty(item.id, -0.5)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors">
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={e => updateQuantity(item.id, e.target.value)}
                                            step="0.5"
                                            min="0"
                                            className="w-12 text-center bg-transparent border-none text-slate-200 text-sm font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <span className="text-[10px] text-slate-500 pr-1">{item.unit}</span>
                                        <button onClick={() => adjustQty(item.id, 0.5)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors">
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>

                                    <span className="text-sm font-black text-emerald-400 font-mono">
                                        {formatCurrency(item.price * item.quantity)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Notes */}
                <div className="px-4 pt-3 pb-0 flex-shrink-0 border-t border-slate-800/50">
                    <textarea
                        rows={2}
                        placeholder="Ghi chú đơn hàng (tuỳ chọn)..."
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl text-slate-300 text-xs placeholder-slate-600 px-3 py-2.5 focus:outline-none focus:border-emerald-500 resize-none transition-colors"
                    />
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-950 flex-shrink-0">
                    <div className="flex justify-between items-center mb-1 text-sm">
                        <span className="text-slate-400">Tổng số lượng</span>
                        <span className="text-slate-300 font-medium">{totalItems.toFixed(1)} mục</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-200 font-bold">Thành tiền</span>
                        <span className="text-2xl font-black text-emerald-400 font-mono">{formatCurrency(totalAmount)}</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || isSubmitting}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-widest text-sm"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Đang lưu...</>
                        ) : (
                            <><ClipboardList className="w-5 h-5" /> Chốt Đơn & Lưu</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
