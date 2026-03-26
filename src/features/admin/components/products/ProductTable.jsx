import React from 'react';
import { AlertTriangle, History, Pencil, Trash2, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export default function ProductTable({
    isLoading,
    productsList,
    handleToggleStatus,
    handleOpenHistory,
    handleOpenEdit,
    handleDelete,
    pageData,
    handlePageChange
}) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-700">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950/50 border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-5 font-black uppercase text-xs tracking-widest text-slate-500">Mặt hàng</th>
                            <th className="px-6 py-5 font-black uppercase text-xs tracking-widest text-slate-500 text-center">Danh mục</th>
                            <th className="px-6 py-5 font-black uppercase text-xs tracking-widest text-slate-500 text-right">Đơn giá</th>
                            <th className="px-6 py-5 font-black uppercase text-xs tracking-widest text-slate-500 text-center">Tồn kho</th>
                            <th className="px-6 py-5 font-black uppercase text-xs tracking-widest text-slate-500 text-center">Trạng thái</th>
                            <th className="px-6 py-5 font-black uppercase text-xs tracking-widest text-slate-500 text-center">Tác vụ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="font-black uppercase text-xs tracking-[0.2em] text-emerald-500">Đang quét kho hàng...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : productsList.length > 0 ? (
                            productsList.map((product, index) => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-slate-800/40 transition-all group border-l-4 border-l-transparent hover:border-l-emerald-500"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <td className="px-6 py-5">
                                        <div className="font-black text-slate-100 text-lg uppercase group-hover:text-emerald-400 transition-colors leading-none mb-1.5">{product.name}</div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono border border-emerald-500/20 font-bold tracking-wide">{product.sku}</span>
                                            <span className="text-[10px] bg-slate-950 text-slate-500 px-2 py-0.5 rounded-full font-bold border border-slate-800 uppercase">/{product.unit}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="bg-slate-950 text-emerald-500 px-3 py-1 rounded-lg border border-emerald-500/20 text-xs font-black uppercase">
                                            {product.category?.name || 'Chưa phân loại'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right font-black text-white text-base font-mono italic">
                                        {formatPrice(product.defaultPrice)}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className={`text-lg font-black font-mono ${product.stockQuantity <= product.minStockLevel ? 'text-red-500 animate-pulse' : 'text-slate-200'}`}>
                                                {product.stockQuantity}
                                            </span>
                                            {product.stockQuantity <= product.minStockLevel && (
                                                <span className="text-[9px] text-red-400 font-black uppercase flex items-center gap-1 mt-1">
                                                    <AlertTriangle className="w-2.5 h-2.5" /> Sắp hết hàng
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <button
                                                onClick={() => handleToggleStatus(product)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner ${product.isActive ? 'bg-emerald-600 shadow-emerald-900/20' : 'bg-slate-700 shadow-slate-900/20'
                                                    }`}
                                                title={product.isActive ? "Nhấn để dừng" : "Nhấn để bán"}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-md ${product.isActive ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                            <span className={`text-[9px] font-black uppercase tracking-tighter ${product.isActive ? 'text-emerald-500' : 'text-slate-500'}`}>
                                                {product.isActive ? 'Đang bán' : 'Tạm dừng'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => handleOpenHistory(product)}
                                                className="p-3 bg-slate-800 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-500 rounded-2xl transition-all shadow-lg active:scale-90 border-b-2 border-slate-700"
                                                title="Lịch sử kho"
                                            >
                                                <History className="w-4.5 h-4.5" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenEdit(product)}
                                                className="p-3 bg-slate-800 hover:bg-blue-500/20 text-slate-400 hover:text-blue-500 rounded-2xl transition-all shadow-lg active:scale-90 border-b-2 border-slate-700"
                                                title="Sửa"
                                            >
                                                <Pencil className="w-4.5 h-4.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product)}
                                                className="p-3 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-2xl transition-all shadow-lg active:scale-90 border-b-2 border-slate-700"
                                                title="Xóa"
                                            >
                                                <Trash2 className="w-4.5 h-4.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-20">
                                        <Inbox className="w-20 h-20" />
                                        <span className="text-xl font-black uppercase tracking-widest italic">Kho hàng trống</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination inside Table footer for layout consistency */}
            <div className="px-8 py-6 bg-slate-950/30 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3">
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-0.5">Tổng số mặt hàng</span>
                        <span className="text-2xl font-black text-white italic">{pageData?.totalElements || 0}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handlePageChange((pageData?.number || 0) - 1)}
                        disabled={(pageData?.number || 0) === 0 || isLoading}
                        className="p-3 bg-slate-800 hover:bg-slate-700 text-emerald-500 disabled:opacity-20 rounded-2xl transition-all border border-slate-700 active:scale-90"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-2 mx-2">
                        {[...Array(pageData?.totalPages || 0)].map((_, i) => {
                            if (
                                i === 0 ||
                                i === (pageData?.totalPages || 1) - 1 ||
                                (i >= (pageData?.number || 0) - 1 && i <= (pageData?.number || 0) + 1)
                            ) {
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i)}
                                        className={`w-11 h-11 flex items-center justify-center rounded-2xl text-sm font-black transition-all border ${(pageData?.number || 0) === i
                                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-500/30 scale-110 -rotate-3'
                                            : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white hover:bg-slate-800'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            } else if (
                                i === (pageData?.number || 0) - 2 ||
                                i === (pageData?.number || 0) + 2
                            ) {
                                return <span key={i} className="text-slate-800 font-black">...</span>;
                            }
                            return null;
                        })}
                    </div>

                    <button
                        onClick={() => handlePageChange((pageData?.number || 0) + 1)}
                        disabled={(pageData?.number || 0) === (pageData?.totalPages || 1) - 1 || isLoading}
                        className="p-3 bg-slate-800 hover:bg-slate-700 text-emerald-500 disabled:opacity-20 rounded-2xl transition-all border border-slate-700 active:scale-90"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}
