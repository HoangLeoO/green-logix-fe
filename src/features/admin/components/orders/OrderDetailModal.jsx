import React, { useState, useEffect } from 'react';
import {
    X, FileText, Clock, User2, ArrowRight, History, Loader2,
    Truck, PackageCheck, Wallet, Ban, Coins, CheckCircle2, Mail
} from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');
import { toast } from 'sonner';
import { orderApi } from '../../../../api/services/order';
import { useConfirmStore } from '../../../../store/useConfirmStore';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, STATUS_CONFIG } from './OrderConstants';

export default function OrderDetailModal({ order, onClose, onStatusChange }) {
    if (!order) return null;
    const [isChanging, setIsChanging] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    const [logs, setLogs] = useState([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const { showConfirm } = useConfirmStore();

    useEffect(() => {
        if (activeTab === 'history' && logs.length === 0) {
            setIsLoadingLogs(true);
            orderApi.getLogs(order.id)
                .then(data => setLogs(data))
                .catch(() => toast.error('Không thể tải lịch sử!'))
                .finally(() => setIsLoadingLogs(false));
        }
    }, [activeTab, order.id, logs.length]);

    const handleSendEmail = async () => {
        if (!order.customerEmail) {
            toast.error('Khách hàng này chưa có địa chỉ email!');
            return;
        }
        setIsSendingEmail(true);
        try {
            await orderApi.sendInvoice(order.id);
            toast.success(`Đã gửi hóa đơn đến ${order.customerEmail}`);
        } catch (error) {
            console.error('Email send failed:', error);
            toast.error('Gửi email thất bại!');
        } finally {
            setIsSendingEmail(false);
        }
    };

    const handleStatus = (newStatus, label) => {
        showConfirm({
            title: `${label} đơn hàng?`,
            message: `Xác nhận cập nhật đơn "${order.orderCode}" sang trạng thái "${label}"?`,
            confirmText: label,
            type: newStatus === 'cancelled' ? 'danger' : 'success',
            onConfirm: async () => {
                setIsChanging(true);
                try {
                    await orderApi.updateStatus(order.id, newStatus);
                    toast.success(`Đã cập nhật trạng thái!`);
                    onStatusChange();
                    onClose();
                } catch {
                    toast.error('Lỗi cập nhật trạng thái!');
                } finally {
                    setIsChanging(false);
                }
            }
        });
    };

    const getStatusName = (st) => STATUS_CONFIG[st]?.label || st;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-slate-900 border border-slate-700 rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-8 pt-6 pb-4 flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
                            <FileText className="w-6 h-6 text-emerald-400" />
                            Chi tiết đơn hàng
                            <span className="text-emerald-400 text-sm bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">{order.orderCode}</span>
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSendEmail}
                            disabled={isSendingEmail}
                            className="text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 p-2.5 rounded-full transition-all flex items-center gap-2 text-xs font-bold"
                            title="Gửi hóa đơn qua Email"
                        >
                            {isSendingEmail ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                        </button>
                        <button onClick={onClose} className="text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 p-2.5 rounded-full transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-8 border-b border-slate-800 flex gap-8 flex-shrink-0">
                    {['details', 'history'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-sm font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === tab ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                        >
                            {tab === 'details' ? 'Thông tin' : 'Lịch sử xử lý'}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="overflow-y-auto overflow-x-hidden flex-1 no-scrollbar">
                    {activeTab === 'details' ? (
                        <OrderInfoTab order={order} />
                    ) : (
                        <OrderHistoryTab
                            logs={logs}
                            isLoading={isLoadingLogs}
                            getStatusName={getStatusName}
                        />
                    )}
                </div>

                {/* Footer Actions */}
                {activeTab === 'details' && (
                    <div className="px-8 py-5 border-t border-slate-800 flex items-center justify-between gap-4 flex-shrink-0 bg-slate-900">
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Tổng cộng</p>
                            <p className="text-2xl font-black text-emerald-400 font-mono">{formatCurrency(order.totalAmount)}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-end">
                            <OrderActionButtons
                                status={order.status}
                                isChanging={isChanging}
                                handleStatus={handleStatus}
                                onClose={onClose}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function OrderInfoTab({ order }) {
    return (
        <>
            <div className="px-8 py-5 grid grid-cols-2 gap-4 border-b border-slate-800">
                <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Khách hàng</p>
                    <p className="text-white font-bold">
                        {order.customerName}
                        {order.branchName && <span className="block text-xs text-emerald-400 font-medium italic mt-0.5">CN: {order.branchName}</span>}
                    </p>
                </div>
                <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Ngày đặt</p>
                    <p className="text-white font-bold">{dayjs(order.orderDate).format('DD/MM/YYYY')}</p>
                </div>
                <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Nhân viên tạo</p>
                    <p className="text-slate-300">{order.createdBy}</p>
                </div>
                <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Trạng thái</p>
                    <StatusBadge status={order.status} />
                </div>
                {order.notes && (
                    <div className="col-span-2">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Ghi chú</p>
                        <p className="text-slate-400 italic text-sm">"{order.notes}"</p>
                    </div>
                )}
            </div>

            <div className="px-8 py-5">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-3">Danh sách mặt hàng</p>
                <div className="space-y-2">
                    {(order.items || []).map((item, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3">
                            <div>
                                <p className="text-white font-bold text-sm">{item.productName}</p>
                                <p className="text-xs text-slate-500 font-mono">{item.quantity} {item.unit} × {Number(item.unitPrice).toLocaleString('vi-VN')}đ</p>
                            </div>
                            <span className="text-emerald-400 font-black font-mono text-sm">{formatCurrency(item.totalPrice)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

function OrderHistoryTab({ logs, isLoading, getStatusName }) {
    if (isLoading) return (
        <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
    );

    if (logs.length === 0) return (
        <div className="flex flex-col items-center justify-center py-10 opacity-50">
            <History className="w-10 h-10 text-slate-500 mb-3" />
            <span className="text-slate-400 text-sm font-bold uppercase">Không có lịch sử</span>
        </div>
    );

    return (
        <div className="px-8 py-6">
            <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
                {logs.map((log) => {
                    const isCreate = log.actionType === 'CREATE';
                    return (
                        <div key={log.id} className="relative">
                            <div className="absolute -left-[31px] top-1 w-3 h-3 bg-emerald-500 rounded-full ring-4 ring-slate-900" />
                            <div className="mb-1 flex items-center justify-between">
                                <h4 className="text-white font-bold text-sm">
                                    {isCreate ? 'Tạo đơn hàng' : 'Cập nhật trạng thái'}
                                </h4>
                                <span className="text-xs text-slate-500 font-mono flex items-center gap-1" title={dayjs(log.createdAt).format('DD/MM/YYYY HH:mm:ss')}>
                                    <Clock className="w-3 h-3" />
                                    {dayjs(log.createdAt).fromNow()}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                                <User2 className="w-3 h-3" /> {log.userFullName || log.username || 'Hệ thống'}
                            </div>

                            {!isCreate && log.oldData?.status && log.newData?.status && (
                                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 inline-flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-400">{getStatusName(log.oldData.status)}</span>
                                    <ArrowRight className="w-4 h-4 text-emerald-500" />
                                    <span className="text-xs font-bold text-emerald-400">{getStatusName(log.newData.status)}</span>
                                </div>
                            )}
                            {isCreate && (
                                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 inline-flex items-center gap-3">
                                    <span className="text-xs font-bold text-emerald-400">Đơn hàng mới</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function OrderActionButtons({ status, isChanging, handleStatus, onClose }) {
    if (status === 'pending') return (
        <>
            <button onClick={() => handleStatus('delivering', 'Giao hàng')} disabled={isChanging} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all active:scale-95 text-xs">
                <Truck className="w-4 h-4" /> Giao hàng
            </button>
            <button onClick={() => handleStatus('paid', 'Thu tiền')} disabled={isChanging} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all active:scale-95 text-xs">
                <PackageCheck className="w-4 h-4" /> Thu tiền
            </button>
            <button onClick={() => handleStatus('debt', 'Bán nợ')} disabled={isChanging} className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold transition-all active:scale-95 text-xs">
                <Wallet className="w-4 h-4" /> Bán nợ
            </button>
            <button onClick={() => handleStatus('cancelled', 'Hủy')} disabled={isChanging} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-bold transition-all active:scale-95 text-xs">
                <Ban className="w-4 h-4" /> Hủy
            </button>
        </>
    );

    if (status === 'delivering') return (
        <>
            <button onClick={() => handleStatus('paid', 'Đã thu tiền')} disabled={isChanging} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all active:scale-95 text-xs">
                <CheckCircle2 className="w-4 h-4" /> Đã thu tiền
            </button>
            <button onClick={() => handleStatus('debt', 'Khách nợ')} disabled={isChanging} className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold transition-all active:scale-95 text-xs">
                <Wallet className="w-4 h-4" /> Khách nợ
            </button>
            <button onClick={() => handleStatus('cancelled', 'Giao thất bại')} disabled={isChanging} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-bold transition-all active:scale-95 text-xs">
                <Ban className="w-4 h-4" /> Hủy đơn
            </button>
        </>
    );

    if (status === 'debt' || status === 'partial_paid') return (
        <button onClick={() => handleStatus('paid', 'Tất toán tiền nợ')} disabled={isChanging} className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all active:scale-95 text-sm">
            <Coins className="w-5 h-5" /> Tất toán nợ
        </button>
    );

    return (
        <button onClick={onClose} className="px-8 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all text-sm">
            Đóng
        </button>
    );
}
