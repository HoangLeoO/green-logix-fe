import React, { useState } from 'react';
import {
    FileText,
    CreditCard,
    Calendar,
    AlertTriangle,
    ChevronRight,
    TrendingDown,
    Info,
    Clock
} from 'lucide-react';

const mockPurchaseHistory = [
    { id: 'ORD-105', date: '25/10/2023', items: 'Cải ngọt, Cà chua, +3...', amount: 840000, status: 'debt' },
    { id: 'ORD-092', date: '24/10/2023', items: 'Hành tây, Khoai tây, +1...', amount: 450000, status: 'paid' },
    { id: 'ORD-085', date: '21/10/2023', items: 'Rau muống, Tỏi, Cải...', amount: 820000, status: 'paid' },
    { id: 'ORD-071', date: '18/10/2023', items: 'Bắp cải, Nấm đùi gà...', amount: 1200000, status: 'debt' },
];

export default function History() {
    const [showReportModal, setShowReportModal] = useState(false);

    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    // Tính tổng nợ từ mock data
    const totalDebt = mockPurchaseHistory
        .filter(order => order.status === 'debt')
        .reduce((sum, order) => sum + order.amount, 0);

    return (
        <div className="p-4 md:p-6 lg:p-8 font-sans pb-24 md:pb-8 flex flex-col gap-6 max-w-4xl mx-auto">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FileText className="w-6 h-6 text-emerald-500" />
                    Lịch sử & Công nợ
                </h1>
                <p className="text-slate-400 mt-1 text-sm">Theo dõi hóa đơn mua hàng và số tiền chưa thanh toán</p>
            </div>

            {/* CÔNG CỤ THEO DÕI NỢ */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full group-hover:bg-red-500/20 transition-colors pointer-events-none"></div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 text-slate-400 font-medium mb-2">
                            <CreditCard className="w-5 h-5 text-red-400" />
                            Tổng dư nợ cần thanh toán
                        </div>
                        {totalDebt > 0 ? (
                            <div className="text-4xl md:text-5xl font-extrabold text-red-500 tracking-tight drop-shadow-sm mb-1">
                                {formatCurrency(totalDebt)}
                            </div>
                        ) : (
                            <div className="text-4xl font-extrabold text-emerald-500 tracking-tight drop-shadow-sm mb-1">
                                0 đ
                            </div>
                        )}
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-2">
                            <Info className="w-4 h-4" /> Vui lòng thanh toán vào cuối tuần
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowReportModal(true)}
                            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-3 rounded-xl transition-colors text-sm border border-slate-700"
                        >
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            Báo cáo sai lệch
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm shadow-lg shadow-emerald-500/20 border border-emerald-500/50">
                            Thanh toán Nợ
                        </button>
                    </div>
                </div>
            </div>

            {/* LỊCH SỬ ĐẶT HÀNG */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-sm overflow-hidden mt-2">
                <div className="p-5 md:p-6 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between sticky top-0 backdrop-blur-md z-10">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-emerald-400" />
                        Lịch sử các Đơn Hàng gần đây
                    </h2>
                </div>

                <div className="divide-y divide-slate-800/80">
                    {mockPurchaseHistory.map((order) => (
                        <div key={`hist-${order.id}`} className="p-5 md:p-6 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer">
                            <div className="flex gap-4 items-start">
                                {/* Icon Trạng Thái Nợ/Đã trả */}
                                <div className={`mt-1 p-2 rounded-xl shrink-0 border ${order.status === 'debt' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                    {order.status === 'debt' ? <TrendingDown className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-bold text-slate-200 text-base">{order.id}</span>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border tracking-wider ${order.status === 'debt' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}>
                                            {order.status === 'debt' ? 'Chưa thanh toán' : 'Đã trả'}
                                        </span>
                                    </div>
                                    <div className="text-slate-400 text-sm mb-1.5 flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" /> Giao ngày: {order.date}
                                    </div>
                                    <p className="text-slate-500 text-xs italic">{order.items}</p>
                                </div>
                            </div>

                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t border-slate-800 sm:border-0 pt-4 sm:pt-0 pl-14 sm:pl-0">
                                <span className={`text-lg sm:text-xl font-bold tracking-tight mb-1 ${order.status === 'debt' ? 'text-red-400' : 'text-slate-200'}`}>
                                    {formatCurrency(order.amount)}
                                </span>
                                <span className="text-xs text-emerald-500 font-medium group-hover:text-emerald-400 flex items-center gap-1">
                                    Xem chi tiết <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-center">
                    <button className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors">Tải thêm lịch sử cũ...</button>
                </div>
            </div>

            {/* BÁO CÁO MODAL */}
            {showReportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowReportModal(false)}></div>
                    <div className="relative bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-6 h-6 text-amber-500" />
                            Báo cáo sai lệch số liệu
                        </h3>
                        <p className="text-sm text-slate-400 mb-6">Xin vui lòng cho biết đơn hàng nào bị ghi nợ sai hoặc có nhầm lẫn số lượng để xưởng kiểm tra lại nhé.</p>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Mã đơn hàng (Tuỳ chọn)</label>
                                <input type="text" placeholder="VD: ORD-105" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-emerald-500" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Nội dung thắc mắc</label>
                                <textarea rows="4" placeholder="VD: Ngày 25/10 tôi đã thanh toán tiền mặt 840k cho tài xế..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"></textarea>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setShowReportModal(false)} className="px-5 py-2.5 rounded-xl font-medium text-slate-400 hover:text-white transition-colors">Hủy</button>
                            <button onClick={() => { setShowReportModal(false); alert('Đã gửi phản hồi. Chúng tôi sẽ liên hệ lại qua mục Tin nhắn Zalo sắp tới.'); }} className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-amber-500/20">Gửi Phản Hồi</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
