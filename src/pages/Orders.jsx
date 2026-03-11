import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Download,
    CheckCircle2,
    Clock,
    MoreVertical,
    CalendarDays,
    User,
    PackageCheck
} from 'lucide-react';
import { toast } from 'sonner';

// --- MOCK DATA ---
const initialOrders = [
    { id: 'ORD-001', customer: 'Cô Ba (Chợ Bến Thành)', date: '2023-10-24', amount: 450000, status: 'completed', items: '20kg Cải Chíp, 10kg Cà chua' },
    { id: 'ORD-002', customer: 'Chú Tư (Q.4)', date: '2023-10-24', amount: 1200000, status: 'pending', items: '50kg Dưa hấu, 20kg Xoài' },
    { id: 'ORD-003', customer: 'Nhà hàng chay Bồ Đề', date: '2023-10-24', amount: 850000, status: 'debt', items: '30kg Nấm đùi gà, 15kg Rau muống' },
    { id: 'ORD-004', customer: 'Chị Lan (Bình Thạnh)', date: '2023-10-23', amount: 320000, status: 'completed', items: '10kg Xà lách, 5kg Hành tây' },
    { id: 'ORD-005', customer: 'Bếp Cơm Mười Khó', date: '2023-10-23', amount: 2100000, status: 'debt', items: '100kg Gạo, 50kg Bắp cải' },
    { id: 'ORD-006', customer: 'Nhà hàng chay Bồ Đề', date: '2023-10-22', amount: 1500000, status: 'completed', items: '50kg Nấm rơm, 20kg Đậu cô ve' },
];

export default function Orders() {
    const [orders, setOrders] = useState(initialOrders);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCustomer, setFilterCustomer] = useState('');
    const [filterDate, setFilterDate] = useState('');

    // Mô phỏng WebSockets: Random thêm một đơn hàng mới sau 15s để trải nghiệm Realtime
    useEffect(() => {
        const timer = setInterval(() => {
            const newOrder = {
                id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
                customer: 'Khách vãng lai (Mới)',
                date: new Date().toISOString().split('T')[0],
                amount: Math.floor(Math.random() * 500000) + 100000,
                status: 'pending',
                items: '5kg Rau dền, 2kg Cà chua'
            };
            // Thêm vào đầu danh sách
            setOrders(prev => [newOrder, ...prev]);
        }, 15000); // 15s có đơn mới

        return () => clearInterval(timer);
    }, [orders.length]);

    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    const handleMarkAsPaid = (orderId) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId
                    ? { ...order, status: 'completed' }
                    : order
            )
        );
    };

    const handleExportExcel = () => {
        // Giả lập chức năng xuất Excel
        toast.info("Đang xuất danh sách đơn hàng ra file Excel (GreenLogix_Orders.xlsx)...");
    };

    // Logic lọc dữ liệu
    const filteredOrders = orders.filter(order => {
        const matchStatus = filterStatus === 'all' || order.status === filterStatus;
        const matchCustomer = order.customer.toLowerCase().includes(filterCustomer.toLowerCase());
        const matchDate = filterDate === '' || order.date === filterDate;
        return matchStatus && matchCustomer && matchDate;
    });

    return (
        <div className="p-4 md:p-8 font-sans pb-24 md:pb-8">

            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <span className="w-2 h-8 bg-emerald-500 rounded-full inline-block"></span>
                        Quản lý Đơn hàng
                    </h1>
                    <p className="text-slate-400 mt-1 ml-5">Kiểm soát trạng thái, công nợ và chi tiết giao dịch</p>
                </div>

                <button
                    onClick={handleExportExcel}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-600/20"
                >
                    <Download className="w-4 h-4" />
                    Xuất dữ liệu Excel
                </button>
            </div>

            {/* Filters Area */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm mb-6 flex flex-col lg:flex-row gap-4">

                {/* Tìm theo tên KH */}
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm theo tên Khách hàng..."
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 bg-slate-950/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                        value={filterCustomer}
                        onChange={(e) => setFilterCustomer(e.target.value)}
                    />
                </div>

                {/* Lọc theo ngày */}
                <div className="lg:w-64 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarDays className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                        type="date"
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 bg-slate-950/50 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-sm transition-all [color-scheme:dark]"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />
                </div>

                {/* Lọc theo Trạng thái */}
                <div className="lg:w-64 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Filter className="h-4 w-4 text-slate-500" />
                    </div>
                    <select
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 bg-slate-950/50 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-sm transition-all appearance-none cursor-pointer"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="pending">Chờ xử lý / Đang giao</option>
                        <option value="completed">Đã thanh toán (Hoàn thành)</option>
                        <option value="debt">Đang ghi nợ</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg relative overflow-hidden">

                {/* Sync Indicator */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50 relative pointer-events-none">
                    <div className="absolute inset-0 bg-emerald-400 opacity-50 blur-[2px] animate-pulse"></div>
                </div>

                <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-sm font-medium text-emerald-400">Đang đồng bộ Real-time</span>
                    </div>
                    <p className="text-sm text-slate-400">Hiển thị {filteredOrders.length} đơn hàng</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
                            <tr>
                                <th className="px-5 py-4 font-semibold whitespace-nowrap hidden md:table-cell">Mã Đơn</th>
                                <th className="px-5 py-4 font-semibold min-w-[200px]">Khách hàng</th>
                                <th className="px-5 py-4 font-semibold hidden lg:table-cell">Mặt hàng (Tóm tắt)</th>
                                <th className="px-5 py-4 font-semibold whitespace-nowrap">Tổng tiền</th>
                                <th className="px-5 py-4 font-semibold text-center whitespace-nowrap">Trạng thái</th>
                                <th className="px-5 py-4 font-semibold text-right whitespace-nowrap">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-5 py-4 hidden md:table-cell">
                                            <span className="font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700">{order.id}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-slate-200 mb-1">{order.customer}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                                <CalendarDays className="w-3 h-3" /> {order.date}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-slate-400 truncate max-w-[200px] hidden lg:table-cell" title={order.items}>
                                            {order.items}
                                        </td>
                                        <td className="px-5 py-4 font-bold text-white whitespace-nowrap">
                                            {formatCurrency(order.amount)}
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <div className="flex justify-center">
                                                {order.status === 'completed' && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã thu tiền
                                                    </span>
                                                )}
                                                {order.status === 'pending' && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                                        <Clock className="w-3.5 h-3.5" /> Chờ xử lý
                                                    </span>
                                                )}
                                                {order.status === 'debt' && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                        <User className="w-3.5 h-3.5" /> Còn nợ
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            {order.status !== 'completed' ? (
                                                <button
                                                    onClick={() => handleMarkAsPaid(order.id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-400 text-xs font-medium rounded-lg transition-colors border border-emerald-500/30 whitespace-nowrap"
                                                    title="Đánh dấu đã thu tiền mặt hoặc chuyển khoản"
                                                >
                                                    <PackageCheck className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Thu đủ</span>
                                                </button>
                                            ) : (
                                                <button className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-800">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-5 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Search className="w-10 h-10 mb-3 text-slate-600 opacity-50" />
                                            <p>Không tìm thấy đơn hàng nào phù hợp với bộ lọc hiện tại.</p>
                                            <button
                                                onClick={() => { setFilterCustomer(''); setFilterStatus('all'); setFilterDate(''); }}
                                                className="mt-3 text-sm text-emerald-400 hover:underline"
                                            >
                                                Xóa tất cả bộ lọc
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
