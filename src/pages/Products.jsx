import React, { useState } from 'react';
import {
    Search,
    Plus,
    MoreVertical,
    Package,
    Leaf,
    Edit,
    Trash2,
    FolderTree,
    Tag
} from 'lucide-react';

// --- MOCK DATA ---
const mockCategories = [
    { id: 'cat1', name: 'Rau ăn lá', count: 12 },
    { id: 'cat2', name: 'Củ quả', count: 8 },
    { id: 'cat3', name: 'Gia vị', count: 5 },
    { id: 'cat4', name: 'Nấm các loại', count: 4 },
];

const initialProducts = [
    { id: 'PRD-101', name: 'Cải ngọt', price: 15000, unit: 'kg', category: 'Rau ăn lá', inStock: true, image: '🥬' },
    { id: 'PRD-102', name: 'Rau muống', price: 12000, unit: 'kg', category: 'Rau ăn lá', inStock: true, image: '🌿' },
    { id: 'PRD-103', name: 'Cà chua Đà Lạt', price: 25000, unit: 'kg', category: 'Củ quả', inStock: true, image: '🍅' },
    { id: 'PRD-104', name: 'Hành tây', price: 18000, unit: 'kg', category: 'Củ quả', inStock: false, image: '🧅' },
    { id: 'PRD-105', name: 'Ớt sừng', price: 40000, unit: 'kg', category: 'Gia vị', inStock: true, image: '🌶️' },
    { id: 'PRD-106', name: 'Nấm đùi gà', price: 55000, unit: 'kg', category: 'Nấm các loại', inStock: true, image: '🍄' },
    { id: 'PRD-107', name: 'Khoai lang Nhật', price: 22000, unit: 'kg', category: 'Củ quả', inStock: false, image: '🍠' },
    { id: 'PRD-108', name: 'Tỏi Bắc', price: 65000, unit: 'kg', category: 'Gia vị', inStock: true, image: '🧄' },
];

export default function Products() {
    const [products, setProducts] = useState(initialProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCat, setSelectedCat] = useState('all');

    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    // Toggle In Stock / Out of Stock
    const toggleStockStatus = (productId) => {
        setProducts(prev =>
            prev.map(p => p.id === productId ? { ...p, inStock: !p.inStock } : p)
        );
    };

    // Filter products directly
    const filteredProducts = products.filter(p => {
        const matchCat = selectedCat === 'all' || p.category === selectedCat;
        const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div className="p-4 md:p-8 font-sans pb-24 md:pb-8 flex flex-col lg:flex-row gap-6">

            {/* ---------------- CỘT TRÁI: DANH MỤC ---------------- */}
            <div className="lg:w-1/4 flex flex-col gap-6">

                {/* Header Title Mobile Only - Visible only on small screens */}
                <div className="lg:hidden mb-2">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <span className="w-2 h-8 bg-emerald-500 rounded-full inline-block"></span>
                        Kho Hàng
                    </h1>
                    <p className="text-slate-400 mt-1 ml-5 text-sm">Quản lý Sản phẩm & Danh mục</p>
                </div>

                {/* Danh mục Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm p-5">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <FolderTree className="w-5 h-5 text-emerald-400" />
                            Danh mục
                        </h2>
                        <button className="text-emerald-400 hover:text-emerald-300 p-1 bg-emerald-500/10 rounded-md transition-colors">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setSelectedCat('all')}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${selectedCat === 'all'
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4" /> Tất cả sản phẩm
                                </div>
                                <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-md font-mono">{products.length}</span>
                            </button>
                        </li>

                        {mockCategories.map(cat => (
                            <li key={cat.id}>
                                <button
                                    onClick={() => setSelectedCat(cat.name)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${selectedCat === cat.name
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Leaf className="w-4 h-4" /> {cat.name}
                                    </div>
                                    <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-md font-mono">{products.filter(p => p.category === cat.name).length}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>


            {/* ---------------- CỘT PHẢI: DANH SÁCH SẢN PHẨM ---------------- */}
            <div className="lg:w-3/4 flex flex-col gap-6">

                {/* Header Title Desktop Only */}
                <div className="hidden lg:flex justify-between items-center bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Package className="w-6 h-6 text-emerald-400" />
                            Sản phẩm & Cài đặt giá
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Cập nhật giá, thêm mới, hoặc đánh dấu Hết Hàng khẩn cấp</p>
                    </div>
                    <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-600/20">
                        <Plus className="w-5 h-5" />
                        Thêm sản phẩm mới
                    </button>
                </div>

                {/* Toolbar: Search & Action mobile */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm tên sản phẩm hoặc mã (VD: PRD-101)..."
                            className="block w-full pl-10 pr-3 py-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button className="lg:hidden flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-600/20">
                        <Plus className="w-5 h-5" />
                        Thêm mới
                    </button>
                </div>

                {/* Bảng Danh sách Sản phẩm */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden flex-1">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800 shadow-sm">
                                <tr>
                                    <th className="px-5 py-4 font-semibold w-16 text-center">Icon</th>
                                    <th className="px-5 py-4 font-semibold min-w-[200px]">Thông tin Sản phẩm</th>
                                    <th className="px-5 py-4 font-semibold">Giá chuẩn</th>
                                    <th className="px-5 py-4 font-semibold text-center">Còn hàng (Toggle)</th>
                                    <th className="px-5 py-4 font-semibold text-right">Tác vụ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id} className={`hover:bg-slate-800/30 transition-colors group ${!product.inStock ? 'opacity-60 grayscale-[50%]' : ''}`}>
                                            <td className="px-5 py-4 text-center">
                                                <div className="text-3xl filter drop-shadow-md group-hover:scale-110 transition-transform origin-center">
                                                    {product.image}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="font-bold text-slate-200 text-base mb-1 group-hover:text-emerald-400 transition-colors">
                                                    {product.name}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">{product.id}</span>
                                                    <span className="text-slate-400 flex items-center gap-1">• Luôn bán theo: <strong className="text-slate-300">{product.unit}</strong></span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="font-bold text-emerald-400 tracking-wide bg-emerald-500/10 px-2.5 py-1 rounded inline-block border border-emerald-500/20">
                                                    {formatCurrency(product.price)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                {/* Toggle Switch */}
                                                <div className="flex items-center justify-center">
                                                    <div
                                                        onClick={() => toggleStockStatus(product.id)}
                                                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer shadow-inner transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 border ${product.inStock ? 'bg-emerald-500 border-emerald-400' : 'bg-slate-700 border-slate-600'
                                                            }`}
                                                    >
                                                        <div
                                                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${product.inStock ? 'translate-x-6' : 'translate-x-0'
                                                                }`}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-[10px] font-medium uppercase tracking-widest">
                                                    {product.inStock ? <span className="text-emerald-400">Đang có</span> : <span className="text-red-400 animate-pulse">Hết hàng</span>}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="p-2 text-slate-400 hover:text-emerald-400 bg-slate-950 hover:bg-slate-800 transition-colors rounded-xl border border-slate-800 hover:border-emerald-500/30">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-red-400 bg-slate-950 hover:bg-slate-800 transition-colors rounded-xl border border-slate-800 hover:border-red-500/30">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-5 py-16 text-center text-slate-500">
                                            <Package className="w-12 h-12 mb-3 mx-auto text-slate-600 opacity-30" />
                                            <p className="text-base">Không tìm thấy sản phẩm nào.</p>
                                            <button onClick={() => { setSearchTerm(''); setSelectedCat('all') }} className="mt-2 text-sm text-emerald-400 hover:underline">Xóa bộ lọc</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
