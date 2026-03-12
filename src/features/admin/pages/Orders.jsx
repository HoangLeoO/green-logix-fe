import React, { useState, useEffect, useCallback } from 'react';
import {
    Search, Filter, RefreshCw, CalendarDays, CheckCircle2,
    Clock, XCircle, ChevronLeft, ChevronRight, Eye,
    Loader2, PackageCheck, Ban, ShoppingBag, X, FileText,
    History, ArrowRight, User2
} from 'lucide-react';
import { toast } from 'sonner';
import { orderApi } from '../../../api/services/order';
import { useConfirmStore } from '../../../store/useConfirmStore';
import { useDebounce } from '../../../hooks/useDebounce';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
dayjs.locale('vi');

const formatCurrency = (v) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v || 0);

// ─── Status badge ────────────────────────────────────────
const STATUS_CONFIG = {
    pending: { label: 'Chờ xử lý', icon: Clock, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
    paid: { label: 'Đã thanh toán', icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    cancelled: { label: 'Đã hủy', icon: XCircle, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>
            <Icon className="w-3.5 h-3.5" />{cfg.label}
        </span>
    );
}

// ─── Order Detail Modal ───────────────────────────────────
function OrderDetailModal({ order, onClose, onStatusChange }) {
    if (!order) return null;
    const [isChanging, setIsChanging] = useState(false);
    const { showConfirm } = useConfirmStore();

    // History states
    const [activeTab, setActiveTab] = useState('details');
    const [logs, setLogs] = useState([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(false);

    useEffect(() => {
        if (activeTab === 'history' && logs.length === 0) {
            setIsLoadingLogs(true);
            orderApi.getLogs(order.id)
                .then(data => setLogs(data))
                .catch(() => toast.error('Không thể tải lịch sử!'))
                .finally(() => setIsLoadingLogs(false));
        }
    }, [activeTab, order.id]);

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
                    <button onClick={onClose} className="text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 p-2.5 rounded-full transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-8 border-b border-slate-800 flex gap-8 flex-shrink-0">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`pb-3 text-sm font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'details' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                    >
                        Thông tin
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`pb-3 text-sm font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'history' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                    >
                        Lịch sử xử lý
                    </button>
                </div>

                {/* Tab Content */}
                <div className="overflow-y-auto overflow-x-hidden flex-1 no-scrollbar">
                    {activeTab === 'details' ? (
                        <>
                            {/* Info */}
                            <div className="px-8 py-5 grid grid-cols-2 gap-4 border-b border-slate-800">
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Khách hàng</p>
                                    <p className="text-white font-bold">{order.customerName}</p>
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

                            {/* Items */}
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
                    ) : (
                        <div className="px-8 py-6">
                            {isLoadingLogs ? (
                                <div className="flex justify-center items-center py-12">
                                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                                </div>
                            ) : logs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 opacity-50">
                                    <History className="w-10 h-10 text-slate-500 mb-3" />
                                    <span className="text-slate-400 text-sm font-bold uppercase">Không có lịch sử</span>
                                </div>
                            ) : (
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

                                                {/* Details */}
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
                            )}
                        </div>
                    )}
                </div>

                {/* Total + Actions (Footer) */}
                {activeTab === 'details' && (
                    <div className="px-8 py-5 border-t border-slate-800 flex items-center justify-between gap-4 flex-shrink-0 bg-slate-900">
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Tổng cộng</p>
                            <p className="text-2xl font-black text-emerald-400 font-mono">{formatCurrency(order.totalAmount)}</p>
                        </div>
                        <div className="flex gap-3">
                            {order.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleStatus('paid', 'Thu tiền')}
                                        disabled={isChanging}
                                        className="flex items-center gap-2 px-5 py-2 w-auto bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all active:scale-95 text-sm disabled:opacity-50"
                                    >
                                        <PackageCheck className="w-4 h-4" /> Thu tiền
                                    </button>
                                    <button
                                        onClick={() => handleStatus('cancelled', 'Hủy')}
                                        disabled={isChanging}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-2xl font-bold transition-all active:scale-95 text-sm disabled:opacity-50"
                                    >
                                        <Ban className="w-4 h-4" /> Hủy
                                    </button>
                                </>
                            )}
                            {order.status !== 'pending' && (
                                <button onClick={onClose} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all text-sm">
                                    Đóng
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────
export default function Orders() {
    const { showConfirm } = useConfirmStore();

    const [pageData, setPageData] = useState({ content: [], totalPages: 0, totalElements: 0, number: 0, size: 10 });
    const [isLoading, setIsLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const debouncedSearch = useDebounce(search, 400);

    const [selectedOrder, setSelectedOrder] = useState(null);

    // ── Fetch ──
    const fetchOrders = useCallback(async (page = 0, showLoading = true) => {
        if (showLoading) setIsLoading(true);
        try {
            const data = await orderApi.getAll({
                page,
                size: pageData.size,
                sort: 'id,desc',
                search: debouncedSearch || undefined,
                status: filterStatus || undefined,
                startDate: filterDate || undefined,
                endDate: filterDate || undefined,
            });
            setPageData(data);
        } catch {
            toast.error('Không tải được danh sách đơn hàng!');
        } finally {
            if (showLoading) setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, filterStatus, filterDate, pageData.size]);

    useEffect(() => { fetchOrders(0); }, [fetchOrders]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pageData.totalPages) fetchOrders(newPage);
    };

    const handleQuickPaid = (order) => {
        showConfirm({
            title: 'Xác nhận thu tiền',
            message: `Đánh dấu đơn "${order.orderCode}" của "${order.customerName}" là đã thu tiền đủ?`,
            confirmText: 'Xác nhận thu',
            type: 'success',
            onConfirm: async () => {
                try {
                    await orderApi.updateStatus(order.id, 'paid');
                    toast.success('Đã cập nhật đơn hàng thành công!');
                    fetchOrders(pageData.number, false);
                } catch {
                    toast.error('Lỗi cập nhật!');
                }
            }
        });
    };

    const ordersList = pageData?.content || [];

    return (
        <div className="p-4 md:p-8 font-sans pb-24 md:pb-8">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-left duration-500">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <span className="w-2 h-8 bg-emerald-500 rounded-full inline-block" />
                        Quản lý Đơn hàng
                    </h1>
                    <p className="text-slate-400 mt-1 ml-5 text-sm">Kiểm soát trạng thái, thanh toán và lịch sử giao dịch</p>
                </div>
                <button
                    onClick={() => fetchOrders(pageData.number, true)}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700 active:scale-95"
                    title="Làm mới"
                >
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Stats summary */}
            <div className="grid grid-cols-3 gap-4 mb-6 animate-in fade-in slide-in-from-bottom duration-500">
                {[
                    { label: 'Tổng đơn', value: pageData.totalElements, icon: ShoppingBag, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                    { label: 'Chờ xử lý', value: ordersList.filter(o => o.status === 'pending').length + (pageData.number > 0 ? '...' : ''), icon: Clock, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
                    { label: 'Đã thu tiền', value: ordersList.filter(o => o.status === 'paid').length + (pageData.number > 0 ? '...' : ''), icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                ].map((stat) => (
                    <div key={stat.label} className={`bg-slate-900 border ${stat.color.split(' ')[2]} rounded-2xl p-4 flex items-center gap-3`}>
                        <div className={`p-2 rounded-xl ${stat.color.split(' ')[1]} border ${stat.color.split(' ')[2]}`}>
                            <stat.icon className={`w-5 h-5 ${stat.color.split(' ')[0]}`} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
                            <p className={`text-xl font-black ${stat.color.split(' ')[0]}`}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl mb-6 flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom duration-700">
                {/* Search */}
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm khách hàng hoặc mã đơn hàng..."
                        className="block w-full pl-11 pr-4 py-3 border border-slate-700 bg-slate-950/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* Date filter */}
                <div className="relative sm:w-52">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <CalendarDays className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                        type="date"
                        className="block w-full pl-10 pr-3 py-3 border border-slate-700 bg-slate-950/50 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all [color-scheme:dark]"
                        value={filterDate}
                        onChange={e => setFilterDate(e.target.value)}
                    />
                </div>

                {/* Status filter */}
                <div className="relative sm:w-52">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Filter className="h-4 w-4 text-slate-500" />
                    </div>
                    <select
                        className="block w-full pl-10 pr-3 py-3 border border-slate-700 bg-slate-950/50 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all appearance-none cursor-pointer"
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="pending">Chờ xử lý</option>
                        <option value="paid">Đã thanh toán</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                </div>
            </div>

            {/* Table */}
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
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-2 bg-slate-800 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-xl transition-all border border-slate-700 hover:border-blue-500/30 active:scale-95"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {order.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleQuickPaid(order)}
                                                        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-400 text-xs font-bold rounded-xl transition-all border border-emerald-500/30 active:scale-95 whitespace-nowrap"
                                                        title="Mark as paid"
                                                    >
                                                        <PackageCheck className="w-3.5 h-3.5" /> Thu tiền
                                                    </button>
                                                )}
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
                                            <button
                                                onClick={() => { setSearch(''); setFilterStatus(''); setFilterDate(''); }}
                                                className="text-sm text-emerald-400 hover:underline"
                                            >
                                                Xóa bộ lọc
                                            </button>
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

            {/* Order Detail Modal */}
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusChange={() => fetchOrders(pageData.number, false)}
                />
            )}
        </div>
    );
}
