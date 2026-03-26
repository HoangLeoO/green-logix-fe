import React from 'react';
import { Phone, Mail, MapPin, FileText, History, Pencil, Trash2, CheckCircle2, ChevronLeft, ChevronRight, Search, AlertCircle, Wallet } from 'lucide-react';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
};


export default function CustomerTable({
    isLoading,
    customersList,
    handleApprove,
    onOpenDetails,
    handleOpenEdit,
    handleOpenPayment,
    handleDelete,
    pageData,
    handlePageChange
}) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-700">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-5 font-bold tracking-wider">Khách hàng</th>
                            <th className="px-6 py-5 font-bold tracking-wider hidden sm:table-cell text-center">Liên hệ</th>
                            <th className="px-6 py-5 font-bold tracking-wider hidden md:table-cell">Địa chỉ</th>
                            <th className="px-6 py-5 font-bold tracking-wider text-right">Tổng nợ</th>
                            <th className="px-6 py-5 font-bold tracking-wider">Ghi chú</th>
                            <th className="px-6 py-5 font-bold tracking-wider text-center">Tác vụ</th>

                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-20 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative">
                                            <div className="w-12 h-12 border-4 border-emerald-500/20 rounded-full"></div>
                                            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                                        </div>
                                        <span className="font-medium">Đang đồng bộ dữ liệu...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : customersList.length > 0 ? (
                            customersList.map((customer, index) => (
                                <tr
                                    key={customer.id}
                                    className="hover:bg-slate-800/40 transition-colors group"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <td className="px-6 py-5">
                                        <div className="font-extrabold text-slate-100 text-base mb-1.5 group-hover:text-emerald-400 transition-colors uppercase tracking-tight flex items-center gap-2">
                                            {customer.name}
                                            {customer.status === 'pending' && (
                                                <span className="shrink-0 flex items-center gap-1 text-[9px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                                    <AlertCircle className="w-3 h-3" /> Chờ duyệt
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono border border-emerald-500/20 font-bold tracking-wide">{customer.customerCode}</span>
                                            <span className="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-mono border border-slate-700">#{customer.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 hidden sm:table-cell">
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center gap-2 mb-1 text-emerald-400 font-bold font-mono">
                                                <Phone className="w-3.5 h-3.5" /> {customer.phone}
                                            </div>
                                            {customer.email && (
                                                <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                                                    <Mail className="w-3.5 h-3.5 text-slate-500" /> {customer.email}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-slate-400 hidden md:table-cell max-w-[200px] truncate">
                                        <div className="flex items-start gap-2.5">
                                            <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                                            <span className="truncate leading-relaxed" title={customer.address}>{customer.address || <span className="text-slate-600 italic">Trống</span>}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex flex-col items-end">
                                            <div className={`font-mono font-bold text-base ${customer.totalDebt > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                {formatCurrency(customer.totalDebt)}
                                            </div>
                                            {customer.totalDebt > 0 && (
                                                <span className="text-[10px] text-slate-500 uppercase tracking-tighter flex items-center gap-1 mt-0.5 font-bold">
                                                    <Wallet className="w-3 h-3" /> Cần thu hồi
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-slate-400 max-w-[150px] truncate">
                                        <div className="flex items-start gap-2 text-xs">
                                            <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                                            <span className="truncate italic">{customer.notes || '...'}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="flex justify-center gap-2.5">
                                            {customer.status === 'pending' && (
                                                <button
                                                    onClick={() => handleApprove(customer)}
                                                    className="p-2 bg-slate-800 hover:bg-emerald-500/20 text-yellow-400 hover:text-emerald-400 rounded-xl transition-all border border-yellow-500/30 hover:border-emerald-500/30 active:scale-95 flex items-center gap-2 px-3"
                                                    title="Duyệt đối tác"
                                                >
                                                    <CheckCircle2 className="w-4.5 h-4.5" /> <span className="text-xs font-bold uppercase tracking-widest">Duyệt</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => onOpenDetails(customer)}
                                                className="p-2 bg-slate-800 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 rounded-xl transition-all border border-slate-700 hover:border-emerald-500/30 active:scale-95"
                                                title="Lịch sử nhập đơn"
                                            >
                                                <History className="w-4.5 h-4.5" />
                                            </button>
                                            {customer.totalDebt > 0 && (
                                                <button
                                                    onClick={() => handleOpenPayment(customer)}
                                                    className="p-2 bg-slate-800 hover:bg-orange-500/20 text-orange-400 hover:text-orange-400 rounded-xl transition-all border border-orange-500/30 hover:border-orange-500/50 active:scale-95"
                                                    title="Thu nợ khách hàng"
                                                >
                                                    <Wallet className="w-4.5 h-4.5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleOpenEdit(customer)}
                                                className="p-2 bg-slate-800 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-xl transition-all border border-slate-700 hover:border-blue-500/30 active:scale-95"
                                                title="Chỉnh sửa"
                                            >
                                                <Pencil className="w-4.5 h-4.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(customer)}
                                                className="p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all border border-slate-700 hover:border-red-500/30 active:scale-95"
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
                                <td colSpan="5" className="px-6 py-24 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-4 opacity-40">
                                        <Search className="w-16 h-16" />
                                        <span className="text-lg font-medium">Trống - Hãy thử tìm kiếm khác</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-5 bg-slate-800/30 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-sm text-slate-400 font-medium">
                    Tổng cộng <span className="text-white bg-slate-800 px-3 py-1 rounded-full border border-slate-700 mx-1">{pageData?.totalElements || 0}</span> đối tác
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => handlePageChange((pageData?.number || 0) - 1)}
                        disabled={(pageData?.number || 0) === 0 || isLoading}
                        className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all disabled:opacity-20 border border-slate-700 active:scale-90"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-1.5 mx-2">
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
                                        className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all border ${(pageData?.number || 0) === i
                                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/40 scale-110'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            } else if (
                                i === (pageData?.number || 0) - 2 ||
                                i === (pageData?.number || 0) + 2
                            ) {
                                return <span key={i} className="text-slate-700 px-1">•••</span>;
                            }
                            return null;
                        })}
                    </div>

                    <button
                        onClick={() => handlePageChange((pageData?.number || 0) + 1)}
                        disabled={(pageData?.number || 0) === (pageData?.totalPages || 1) - 1 || isLoading}
                        className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all disabled:opacity-20 border border-slate-700 active:scale-90"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
