import React, { useEffect, useState } from 'react';
import {
    X,
    History,
    ArrowUpCircle,
    ArrowDownCircle,
    Calendar,
    Package,
    Loader2,
    Inbox
} from 'lucide-react';
import { stockApi } from '../../../api/services/stock';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

// Thiết lập tiếng Việt cho dayjs
dayjs.locale('vi');

export default function StockHistoryModal({ isOpen, onClose, product }) {
    const [movements, setMovements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen && product) {
            fetchHistory();
        }
    }, [isOpen, product]);

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const data = await stockApi.getByProduct(product.id, { size: 50 });
            setMovements(data.content || []);
        } catch (error) {
            console.error("Lỗi khi tải lịch sử kho:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-slate-900 border border-slate-700 rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
                            <History className="w-6 h-6 text-emerald-400" />
                            Lịch sử biến động kho
                        </h3>
                        <p className="text-slate-400 text-sm font-medium mt-1">Sản phẩm: <span className="text-emerald-400 uppercase font-bold">{product?.name}</span></p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 p-2.5 rounded-full transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-500">Đang truy xuất dữ liệu...</span>
                        </div>
                    ) : movements.length > 0 ? (
                        <div className="space-y-4">
                            {movements.map((item) => (
                                <div key={item.id} className="flex items-start gap-4 p-5 bg-slate-950/50 border border-slate-800 rounded-3xl hover:border-slate-700 transition-colors group">
                                    <div className={`p-3 rounded-2xl ${item.movementType === 'IN'
                                            ? 'bg-emerald-500/10 text-emerald-500'
                                            : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {item.movementType === 'IN' ? <ArrowUpCircle className="w-6 h-6" /> : <ArrowDownCircle className="w-6 h-6" />}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className={`text-xs font-black uppercase tracking-widest ${item.movementType === 'IN' ? 'text-emerald-500' : 'text-red-500'
                                                    }`}>
                                                    {item.movementType === 'IN' ? 'Nhập kho' : 'Xuất kho / Giảm'}
                                                </span>
                                                <h4 className="text-white font-bold text-lg mt-0.5">
                                                    {item.movementType === 'IN' ? '+' : '-'}{item.quantity} {product.unit}
                                                </h4>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] text-slate-500 font-bold uppercase flex items-center justify-end gap-1.5">
                                                    <Calendar className="w-3 h-3" />
                                                    {dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-slate-400 text-sm mt-2 italic">"{item.notes}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-20">
                            <Inbox className="w-16 h-16" />
                            <span className="text-sm font-black uppercase tracking-widest">Chưa có lịch sử biến động</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-slate-800 bg-slate-900/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all active:scale-95"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
