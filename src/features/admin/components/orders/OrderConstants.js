import { Clock, Truck, CheckCircle2, Wallet, Coins, XCircle } from 'lucide-react';

export const STATUS_CONFIG = {
    pending: { label: 'Chờ xử lý', icon: Clock, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
    delivering: { label: 'Đang giao', icon: Truck, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    paid: { label: 'Đã thanh toán', icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    debt: { label: 'Ghi nợ', icon: Wallet, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
    partial_paid: { label: 'Thanh toán 1 phần', icon: Coins, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    cancelled: { label: 'Đã hủy', icon: XCircle, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

export const formatCurrency = (v) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v || 0);
