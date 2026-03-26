import React, { useState, useEffect } from 'react';
import { X, Wallet, Clock, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import paymentService from "../../../../api/services/payment";
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
};

export default function CustomerDetailsModal({ customer, onClose }) {
    const [payments, setPayments] = useState([]);
    const [isLoadingPayments, setIsLoadingPayments] = useState(false);
    const [showPayments, setShowPayments] = useState(false);

    useEffect(() => {
        if (customer?.id) {
            const fetchHistory = async () => {
                setIsLoadingPayments(true);
                try {
                    const data = await paymentService.getPaymentsByCustomer(customer.id);
                    setPayments(data || []);
                } catch (error) {
                    console.error("Lỗi khi tải lịch sử thanh toán:", error);
                } finally {
                    setIsLoadingPayments(false);
                }
            };
            fetchHistory();
        }
    }, [customer?.id]);

    if (!customer) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative bg-slate-900 border border-slate-700 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Hồ sơ đối tác</h3>
                            <p className="text-emerald-500 font-mono mt-1 tracking-widest text-xs font-bold uppercase">UID: {customer.customerCode}</p>
                        </div>
                        <button onClick={onClose} className="text-slate-500 hover:text-white bg-slate-800 p-2.5 rounded-2xl transition-all active:rotate-90">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-950/50 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-inner">
                            <div className="flex flex-col">
                                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Tên khách hàng</span>
                                <span className="text-white text-xl font-black uppercase tracking-tight">{customer.name}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Điện thoại</span>
                                    <span className="text-emerald-400 text-lg font-mono font-bold italic">{customer.phone}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Email</span>
                                    <span className="text-slate-200 font-medium truncate">{customer.email || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="flex flex-col pt-2 border-t border-slate-800/50">
                                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Vị trí kết nối</span>
                                <span className="text-slate-300 leading-relaxed font-medium">{customer.address || 'Chưa định vị'}</span>
                            </div>

                            <div className="p-4 bg-slate-900/80 border border-emerald-500/20 rounded-2xl flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1 flex items-center gap-2">
                                        <Wallet className="w-3 h-3 text-red-400" /> Công nợ hiện tại
                                    </span>
                                    <span className={`text-2xl font-black font-mono italic ${customer.totalDebt > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {formatCurrency(customer.totalDebt)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col pt-2 border-t border-slate-800/50">
                                <button
                                    onClick={() => setShowPayments(!showPayments)}
                                    className="flex justify-between items-center w-full py-1 group"
                                >
                                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 group-hover:text-slate-300 transition-colors">
                                        <Clock className="w-3 h-3" /> Lịch sử thanh toán ({payments.length})
                                    </span>
                                    {showPayments ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                                </button>

                                {showPayments && (
                                    <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        {isLoadingPayments ? (
                                            <div className="text-center py-4 text-slate-500 text-xs animate-pulse italic">Đang tải lịch sử...</div>
                                        ) : payments.length > 0 ? (
                                            payments.map((p, idx) => (
                                                <div key={idx} className="bg-slate-900 border border-slate-800/50 p-3 rounded-xl flex justify-between items-center group hover:border-emerald-500/30 transition-all">
                                                    <div>
                                                        <div className="text-emerald-400 font-bold text-sm tracking-tight">+{formatCurrency(p.amount)}</div>
                                                        <div className="text-slate-500 text-[10px] font-mono mt-0.5 uppercase tracking-tighter">
                                                            {new Date(p.paymentDate).toLocaleDateString('vi-VN')} • {p.paymentMethod}
                                                        </div>
                                                    </div>
                                                    <div className="text-[10px] text-slate-600 bg-slate-950 px-2 py-1 rounded-md font-mono border border-slate-800">
                                                        {p.transactionId ? `TID: ${p.transactionId.substring(0, 8)}...` : 'CASH'}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-6 text-slate-700 text-xs italic border border-dashed border-slate-800 rounded-xl">Chưa có giao dịch thanh toán nào.</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Ghi chú đặc biệt</span>
                                <div className="text-slate-400 text-sm bg-slate-900 border border-slate-800/50 p-4 rounded-2xl italic leading-relaxed">
                                    {customer.notes || 'Hệ thống chưa ghi nhận thông tin bổ sung.'}
                                </div>
                            </div>

                            {customer.branches?.length > 0 && (
                                <div className="flex flex-col pt-4 border-t border-slate-800/50">
                                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-3 flex items-center gap-2">
                                        Các chi nhánh ({customer.branches.length})
                                    </span>
                                    <div className="grid grid-cols-1 gap-2">
                                        {customer.branches.map((b, idx) => (
                                            <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-xl hover:border-slate-700 transition-colors">
                                                <div className="text-emerald-400 font-bold text-sm mb-1 uppercase tracking-tight">{b.branchName}</div>
                                                <div className="flex justify-between items-center text-slate-400 text-[10px]">
                                                    <span className="font-mono">{b.phone || 'N/A'}</span>
                                                    <span className="truncate ml-4 max-w-[150px] italic">{b.address || 'N/A'}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all font-black uppercase tracking-widest text-xs border border-slate-700 shadow-xl active:scale-95"
                        >
                            Đóng hồ sơ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
