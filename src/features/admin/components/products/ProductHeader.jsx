import React from 'react';
import { Package, RefreshCw, Plus } from 'lucide-react';

export default function ProductHeader({ fetchProducts, isLoading, handleOpenAdd }) {
    return (
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="animate-in fade-in slide-in-from-left duration-500">
                <h1 className="text-3xl font-black text-white flex items-center gap-3 italic uppercase tracking-tighter">
                    <Package className="w-10 h-10 text-emerald-500" />
                    Kho Sản Phẩm
                </h1>
                <p className="text-slate-400 mt-1 font-medium">Lọc theo tên hoặc danh mục hàng hóa</p>
            </div>

            <div className="flex gap-3 animate-in fade-in slide-in-from-right duration-500">
                <button
                    onClick={fetchProducts}
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition-all border border-slate-700 active:scale-95 shadow-lg"
                    title="Làm mới"
                >
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black uppercase text-sm tracking-widest transition-all shadow-xl shadow-emerald-600/20 active:scale-95 border-b-4 border-emerald-800 hover:border-emerald-700"
                >
                    <Plus className="w-5 h-5" />
                    Thêm mặt hàng
                </button>
            </div>
        </div>
    );
}
