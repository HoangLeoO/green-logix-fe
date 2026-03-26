import React, { useState } from 'react';
import { CalendarDays, Eye, ShoppingBag, ChevronLeft, ChevronRight, Copy, Loader2 } from 'lucide-react';
import dayjs from 'dayjs';
import { StatusBadge } from './StatusBadge';
import { formatCurrency } from './OrderConstants';

export default function OrderTable({ isLoading, ordersList, onSelectOrder, onCopyOrder, pageData, handlePageChange }) {
    const [copyingId, setCopyingId] = useState(null);

    const handleCopy = async (id) => {
        setCopyingId(id);
        await onCopyOrder(id);
        setCopyingId(null);
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-700">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-5 font-bold tracking-wider whitespace-nowrap">Mã đơn</th>
                            <th className="px-6 py-5 font-bold tracking-wider">Khách hàng</th>
                            <th className="px-6 py-5 font-bold tracking-wider hidden md:table-cell">Mặt hàng</th>
                            <th className="px-6 py-5 font-bold tracking-wider whitespace-nowrap">Tổng tiền</th>
                            <th className="px-6 py-5 font-bold tracking-wider text-center">Trạng thái</th>
                            <th className="px-6 py-5 font-bold tracking-wider text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-20 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative">
                                            <div className="w-12 h-12 border-4 border-emerald-500/20 rounded-full" />
                                            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
                                        </div>
                                        <span className="font-medium text-xs uppercase tracking-widest text-emerald-500">Đang tải dữ liệu...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : ordersList.length > 0 ? (
                            ordersList.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <span className="font-mono text-[11px] bg-slate-800 border border-slate-700 text-slate-300 px-2 py-1 rounded-lg">{order.orderCode}</span>
                                        <div className="text-[10px] text-slate-600 mt-1.5 flex items-center gap-1">
                                            <CalendarDays className="w-3 h-3" />
                                            {dayjs(order.orderDate).format('DD/MM/YYYY')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="font-extrabold text-slate-100 text-sm group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{order.customerName}</div>
                                        {order.branchName && <div className="text-[11px] text-emerald-500 mt-0.5 mb-0.5 font-bold italic">CN: {order.branchName}</div>}
                                        <div className="text-[11px] text-slate-500 mt-0.5 italic">Tạo bởi: {order.createdBy}</div>
                                    </td>
                                    <td className="px-6 py-5 hidden md:table-cell">
                                        <div className="text-xs text-slate-400 max-w-[180px]">
                                            {(order.items || []).slice(0, 2).map((item, i) => (
                                                <div key={i} className="truncate">{item.productName} × {item.quantity} {item.unit}</div>
                                            ))}
                                            {(order.items || []).length > 2 && (
                                                <div className="text-slate-600 italic">+{order.items.length - 2} mặt hàng khác</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="font-black text-white font-mono text-sm">{formatCurrency(order.totalAmount)}</span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => onSelectOrder(order)}
                                                className="p-2 bg-slate-800 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-xl transition-all border border-slate-700 hover:border-blue-500/30 active:scale-95"
                                                title="Xem chi tiết"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleCopy(order.id)}
                                                disabled={copyingId === order.id}
                                                className="p-2 bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-500 rounded-xl transition-all border border-slate-700 hover:border-amber-500/30 active:scale-95 disabled:opacity-50"
                                                title="Sao chép đơn này"
                                            >
                                                {copyingId === order.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-30">
                                        <ShoppingBag className="w-16 h-16" />
                                        <span className="text-lg font-bold">Không tìm thấy đơn hàng nào</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-5 bg-slate-800/30 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-400 font-medium">
                    Tổng cộng <span className="text-white bg-slate-800 px-3 py-1 rounded-full border border-slate-700 mx-1">{pageData.totalElements || 0}</span> đơn hàng
                </div>
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => handlePageChange((pageData.number || 0) - 1)}
                        disabled={(pageData.number || 0) === 0 || isLoading}
                        className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all disabled:opacity-20 border border-slate-700 active:scale-90"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-1.5 mx-2">
                        {[...Array(pageData.totalPages || 0)].map((_, i) => {
                            const cur = pageData.number || 0;
                            if (i === 0 || i === (pageData.totalPages || 1) - 1 || (i >= cur - 1 && i <= cur + 1)) {
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i)}
                                        className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all border ${cur === i
                                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                                    >{i + 1}</button>
                                );
                            } else if (i === cur - 2 || i === cur + 2) {
                                return <span key={i} className="text-slate-600 px-1">•••</span>;
                            }
                            return null;
                        })}
                    </div>
                    <button
                        onClick={() => handlePageChange((pageData.number || 0) + 1)}
                        disabled={(pageData.number || 0) >= (pageData.totalPages || 1) - 1 || isLoading}
                        className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all disabled:opacity-20 border border-slate-700 active:scale-90"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
