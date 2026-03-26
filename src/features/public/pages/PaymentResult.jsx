import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowLeft, Loader2, Receipt, Calendar, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
};

export default function PaymentResult() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing'); // processing, success, failed

    const responseCode = searchParams.get('vnp_ResponseCode');
    const amount = searchParams.get('vnp_Amount');
    const orderInfo = searchParams.get('vnp_OrderInfo');
    const transactionNo = searchParams.get('vnp_TransactionNo');
    const payDate = searchParams.get('vnp_PayDate');

    useEffect(() => {
        // VNPay ResponseCode '00' is Success
        if (responseCode === '00') {
            setStatus('success');
            toast.success('Thanh toán thành công!');
        } else if (responseCode) {
            setStatus('failed');
            toast.error('Thanh toán thất bại hoặc bị hủy.');
        }
    }, [responseCode]);

    const handleBack = () => {
        // For Admin, go back to customers. For others, maybe dashboard.
        navigate('/customers');
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-200">
            <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">

                {/* Visual Status Header */}
                <div className={`relative rounded-t-[2.5rem] p-10 text-center overflow-hidden border-t border-x border-slate-800 ${status === 'success' ? 'bg-emerald-500/10' :
                        status === 'failed' ? 'bg-red-500/10' : 'bg-slate-900'
                    }`}>
                    {/* Background Decorative Blur */}
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 blur-[80px] rounded-full opacity-30 ${status === 'success' ? 'bg-emerald-500' :
                            status === 'failed' ? 'bg-red-500' : 'bg-blue-500'
                        }`}></div>

                    <div className="relative z-10 flex flex-col items-center">
                        {status === 'processing' && <Loader2 className="w-20 h-20 text-blue-500 animate-spin mb-6" />}
                        {status === 'success' && <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />}
                        {status === 'failed' && <XCircle className="w-20 h-20 text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />}

                        <h1 className="text-3xl font-black uppercase tracking-tight mb-2">
                            {status === 'success' ? 'Thành công' :
                                status === 'failed' ? 'Thất bại' : 'Đang xử lý'}
                        </h1>
                        <p className="text-slate-400 text-sm font-medium">
                            {status === 'success' ? 'Giao dịch của bạn đã hoàn tất an toàn' :
                                status === 'failed' ? 'Đã có lỗi xảy ra hoặc bạn đã hủy giao dịch' : 'Vui lòng chờ trong giây lát...'}
                        </p>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-slate-900 border-x border-b border-slate-800 rounded-b-[2.5rem] p-8 shadow-2xl">
                    <div className="space-y-6">
                        {/* Summary Box */}
                        <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 text-center">
                            <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Số tiền thanh toán</div>
                            <div className={`text-3xl font-mono font-black ${status === 'success' ? 'text-emerald-400' : 'text-slate-300'}`}>
                                {formatCurrency((parseInt(amount) || 0) / 100)}
                            </div>
                        </div>

                        {/* Details List */}
                        <div className="space-y-4 px-1">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 flex items-center gap-2"><Receipt className="w-4 h-4" /> Mã tham chiếu</span>
                                <span className="text-white font-mono font-bold">{transactionNo || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Nội dung</span>
                                <span className="text-white font-medium italic">{decodeURIComponent(orderInfo || '') || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Thời gian</span>
                                <span className="text-white font-medium">
                                    {payDate ? `${payDate.substring(6, 8)}/${payDate.substring(4, 6)}/${payDate.substring(0, 4)}` : 'N/A'}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-4">
                            <button
                                onClick={handleBack}
                                className="w-full bg-slate-800 hover:bg-slate-750 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-slate-700 shadow-lg"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                {status === 'success' ? 'Quay lại danh sách nợ' : 'Thử lại thanh toán'}
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest italic">
                            Hệ thống quản lý công nợ GreenLogix
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
