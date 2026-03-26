import React, { useState, useEffect } from 'react';
import { X, Wallet, CreditCard, Banknote, FileText, Send, QrCode, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import paymentService from "../../../../api/services/payment";
import settingService from "../../../../api/services/setting";
import vnpayService from "../../../../api/services/vnpay";

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
};

export default function PaymentModal({ customer, onClose, onSuccess }) {
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('BANK');
    const [transactionId, setTransactionId] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Bank Settings
    const [bankInfo, setBankInfo] = useState({
        bank_code: 'VCB',
        bank_account: '',
        bank_account_name: ''
    });

    useEffect(() => {
        const fetchBankSettings = async () => {
            try {
                const response = await settingService.getByGroup('payment');
                const settings = response.data || [];
                const info = {};
                settings.forEach(s => {
                    info[s.key] = s.value;
                });
                if (Object.keys(info).length > 0) {
                    setBankInfo(prev => ({ ...prev, ...info }));
                }
            } catch (error) {
                console.error("Lỗi khi tải cấu hình ngân hàng:", error);
            }
        };
        fetchBankSettings();
    }, []);

    if (!customer) return null;

    const qrUrl = bankInfo.bank_account
        ? `https://img.vietqr.io/image/${bankInfo.bank_code}-${bankInfo.bank_account}-compact2.png?amount=${amount || 0}&addInfo=${encodeURIComponent(`DH ${customer.customerCode} NOP TIEN`)}&accountName=${encodeURIComponent(bankInfo.bank_account_name)}`
        : null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Vui lòng nhập số tiền hợp lệ!");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                customerId: customer.id,
                amount: parseFloat(amount),
                paymentMethod,
                transactionId,
                notes
            };

            if (paymentMethod === 'VNPAY') {
                const orderInfo = `DH ${customer.customerCode} NOP TIEN`;
                const paymentUrl = await vnpayService.createPayment(parseFloat(amount), orderInfo, customer.id);
                window.location.href = paymentUrl;
                return; // Redirect to VNPay
            }

            await paymentService.createPayment(payload);
            toast.success(`Đã thu nợ ${formatCurrency(amount)} từ ${customer.name}`);
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Lỗi khi thu nợ:", error);
            toast.error(error.response?.data?.message || "Không thể thực hiện thanh toán. Vui lòng thử lại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-slate-900 border border-slate-700 rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Form Side */}
                    <div className="p-8 border-r border-slate-800">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
                                    <Wallet className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">Thu nợ khách</h3>
                            </div>
                        </div>

                        <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 mb-6 shadow-inner">
                            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Đối tác</div>
                            <div className="text-white font-bold">{customer.name}</div>
                            <div className="flex justify-between items-end mt-3">
                                <div>
                                    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Dư nợ hiện tại</div>
                                    <div className="text-red-400 font-mono font-bold text-lg italic">{formatCurrency(customer.totalDebt)}</div>
                                </div>
                                <div className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-lg border border-slate-700">
                                    #{customer.customerCode}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-slate-400 text-xs font-bold uppercase mb-2 block px-1">Số tiền (VNĐ)</label>
                                <div className="relative">
                                    <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-400 text-xs font-bold uppercase mb-2 block px-1">PT thanh toán</label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-xs"
                                    >
                                        <option value="BANK">Chuyển khoản</option>
                                        <option value="CASH">Tiền mặt</option>
                                        <option value="VNPAY">Cổng VNPay (Thử nghiệm)</option>
                                        <option value="MOMO">Ví MoMo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-slate-400 text-xs font-bold uppercase mb-2 block px-1">TID / Ref#</label>
                                    <input
                                        type="text"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        placeholder="TID..."
                                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-2xl transition-all font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 border border-emerald-500/30 mt-4 active:scale-[0.98]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        Đang tạo phiếu...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Xác nhận
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* QR Code Side */}
                    <div className="bg-slate-950 p-8 flex flex-col items-center justify-center relative">
                        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white bg-slate-800 p-2 rounded-xl transition-all md:hidden">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-6 text-center">
                            <div className="flex items-center justify-center gap-2 text-slate-400 mb-2">
                                <QrCode className="w-4 h-4" />
                                <span className="text-[10px] uppercase font-black tracking-widest">VietQR Dynamic</span>
                            </div>
                            <p className="text-white text-xs font-medium opacity-60">Khách quét mã để nạp tiền nhanh</p>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-500 opacity-50"></div>
                            <div className="relative bg-white p-4 rounded-3xl shadow-2xl border-4 border-slate-800">
                                {qrUrl ? (
                                    <img
                                        src={qrUrl}
                                        alt="VietQR"
                                        className="w-48 h-48 md:w-56 md:h-56 object-contain"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-48 h-48 md:w-56 md:h-56 bg-slate-100 flex items-center justify-center text-slate-300 text-[10px] p-8 text-center uppercase font-bold">
                                        Đang tải cấu hình QR...
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 text-center space-y-1.5">
                            <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Tài khoản thụ hưởng</div>
                            <div className="text-emerald-400 font-mono font-bold text-sm">{bankInfo.bank_account || '000000000'}</div>
                            <div className="text-white text-xs font-bold uppercase opacity-80">{bankInfo.bank_account_name || 'GREENLOGIX'}</div>
                            <div className="inline-block bg-emerald-500/10 text-emerald-400 text-[9px] px-3 py-1 rounded-full border border-emerald-500/20 mt-2">
                                {bankInfo.bank_code} • NAPAS 24/7
                            </div>
                        </div>

                        <button onClick={onClose} className="hidden md:block absolute bottom-4 text-slate-600 hover:text-white text-[10px] uppercase font-bold tracking-widest hover:underline transition-all">
                            Hủy bỏ và đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
