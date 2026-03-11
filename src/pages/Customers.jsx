import React, { useState } from 'react';
import {
    Search,
    Plus,
    MoreVertical,
    Phone,
    MapPin,
    Mail,
    CreditCard,
    History,
    X,
    UserPlus
} from 'lucide-react';
import { toast } from 'sonner';

// MOCK DATA
const initialCustomers = [
    { id: 'CUST-001', name: 'Cô Ba (Chợ Bến Thành)', phone: '0901234567', email: 'coba@gmail.com', address: 'Sạp 12, Chợ Bến Thành, Q.1', debt: 1500000, type: 'VIP' },
    { id: 'CUST-002', name: 'Chú Tư (Q.4)', phone: '0912345678', email: 'chutu.q4@yahoo.com', address: '123 Đoàn Văn Bơ, Q.4', debt: 3200000, type: 'Thường xuyên' },
    { id: 'CUST-003', name: 'Nhà hàng chay Bồ Đề', phone: '0987123456', email: 'contact@bode.vn', address: '45 Nguyễn Đình Chiểu, Q.3', debt: 0, type: 'Doanh nghiệp' },
    { id: 'CUST-004', name: 'Bếp Cơm Mười Khó', phone: '0987654321', email: 'muoikho@gmail.com', address: 'Quang Trung, Gò Vấp', debt: 8400000, type: 'Sỉ lớn' },
    { id: 'CUST-005', name: 'Chị Lan (Bình Thạnh)', phone: '0909090909', email: 'lan.nguyen@outlook.com', address: 'Bùi Đình Túy, Bình Thạnh', debt: 450000, type: 'Thường xuyên' },
];

const mockHistory = [
    { id: 'ORD-092', date: '2023-10-24', amount: 450000, status: 'completed' },
    { id: 'ORD-085', date: '2023-10-21', amount: 820000, status: 'completed' },
    { id: 'ORD-071', date: '2023-10-18', amount: 1200000, status: 'debt' },
    { id: 'ORD-063', date: '2023-10-15', amount: 300000, status: 'completed' },
];

export default function Customers() {
    const [customers, setCustomers] = useState(initialCustomers);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isAddOpen, setIsAddOpen] = useState(false);

    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    const handleOpenHistory = (customer) => {
        setSelectedCustomer(customer);
        setIsHistoryOpen(true);
    };

    const handleCloseHistory = () => {
        setIsHistoryOpen(false);
        setSelectedCustomer(null);
    };

    return (
        <div className="p-4 md:p-8 font-sans pb-24 md:pb-8">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <span className="w-2 h-8 bg-emerald-500 rounded-full inline-block"></span>
                        Quản lý Khách hàng
                    </h1>
                    <p className="text-slate-400 mt-1 ml-5">Danh sách đối tác, thông tin liên lạc và công nợ</p>
                </div>

                <button
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-600/20"
                >
                    <UserPlus className="w-5 h-5" />
                    Thêm khách hàng mới
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm theo tên Khách hàng hoặc Số điện thoại..."
                        className="block w-full pl-10 pr-3 py-3 border border-slate-700 bg-slate-950/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
                            <tr>
                                <th className="px-5 py-4 font-semibold">Khách hàng</th>
                                <th className="px-5 py-4 font-semibold hidden sm:table-cell">Liên hệ</th>
                                <th className="px-5 py-4 font-semibold hidden md:table-cell">Địa chỉ</th>
                                <th className="px-5 py-4 font-semibold text-right">Tổng nợ</th>
                                <th className="px-5 py-4 font-semibold text-center">Tác vụ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-5 py-4">
                                            <div className="font-bold text-slate-200 text-base mb-1 group-hover:text-emerald-400 transition-colors">{customer.name}</div>
                                            <span className="inline-block bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded border border-slate-700 uppercase tracking-widest">{customer.type}</span>
                                        </td>
                                        <td className="px-5 py-4 hidden sm:table-cell">
                                            <div className="flex items-center gap-2 mb-1 text-slate-300">
                                                <Phone className="w-3.5 h-3.5 text-slate-500" /> {customer.phone}
                                            </div>
                                            {customer.email && (
                                                <div className="flex items-center gap-2 text-slate-400 text-xs">
                                                    <Mail className="w-3.5 h-3.5 text-slate-500" /> {customer.email}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-slate-400 hidden md:table-cell max-w-[200px] truncate">
                                            <div className="flex items-start gap-2">
                                                <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                                                <span className="truncate" title={customer.address}>{customer.address}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            {customer.debt > 0 ? (
                                                <span className="font-bold text-red-400 flex items-center justify-end gap-1.5">
                                                    {formatCurrency(customer.debt)}
                                                    <CreditCard className="w-4 h-4" />
                                                </span>
                                            ) : (
                                                <span className="text-emerald-500 font-medium bg-emerald-500/10 px-2 py-1 rounded-md text-xs border border-emerald-500/20">Không có nợ</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenHistory(customer)}
                                                    className="px-3 py-1.5 bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 text-xs font-medium rounded-lg transition-colors border border-slate-700 hover:border-emerald-500/30 flex items-center gap-1.5 whitespace-nowrap"
                                                >
                                                    <History className="w-4 h-4" />
                                                    <span className="hidden lg:inline">Lịch sử GD</span>
                                                </button>
                                                <button className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-700">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-5 py-12 text-center text-slate-500">
                                        <Search className="w-10 h-10 mb-3 mx-auto text-slate-600 opacity-50" />
                                        Không tìm thấy khách hàng nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL: LỊCH SỬ MUA HÀNG --- */}
            {isHistoryOpen && selectedCustomer && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={handleCloseHistory}></div>
                    <div className="relative bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <History className="w-5 h-5 text-emerald-400" />
                                    Lịch sử Mua hàng
                                </h3>
                                <p className="text-sm text-slate-400 mt-1">Khách hàng: <span className="text-emerald-400 font-medium">{selectedCustomer.name}</span></p>
                            </div>
                            <button onClick={handleCloseHistory} className="text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1 font-semibold">Tổng nợ hiện tại</p>
                                    <p className={`text-2xl font-bold ${selectedCustomer.debt > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {formatCurrency(selectedCustomer.debt)}
                                    </p>
                                </div>
                                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1 font-semibold">GD Gần đây</p>
                                    <p className="text-2xl font-bold text-white">{mockHistory.length} <span className="text-sm text-slate-500 font-normal">đơn</span></p>
                                </div>
                            </div>

                            {/* History List */}
                            <div className="space-y-3">
                                {mockHistory.map((order, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950/50 hover:border-slate-700 transition-colors">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-emerald-400 text-sm">{order.id}</span>
                                                <span className="text-xs text-slate-500">• {order.date}</span>
                                            </div>
                                            <div className="text-sm text-slate-400">
                                                {order.status === 'completed' ? (
                                                    <span className="text-emerald-500">Đã thanh toán</span>
                                                ) : (
                                                    <span className="text-red-400">Ghi nợ</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="font-bold text-white text-lg">
                                            {formatCurrency(order.amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
                            <button
                                onClick={handleCloseHistory}
                                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium text-sm"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL: THÊM KHÁCH HÀNG MỚI (CHỈ UI) --- */}
            {isAddOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsAddOpen(false)}></div>
                    <div className="relative bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-emerald-400" />
                                Thêm Khách hàng mới
                            </h3>
                            <button onClick={() => setIsAddOpen(false)} className="text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Tên khách hàng / Quán ăn *</label>
                                <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500" placeholder="VD: Bếp Cơm Mười Khó" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Số điện thoại *</label>
                                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500" placeholder="09..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Nhóm khách</label>
                                    <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 appearance-none">
                                        <option>Khách lẻ</option>
                                        <option>Sỉ lớn</option>
                                        <option>Doanh nghiệp</option>
                                        <option>Bạn hàng</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Địa chỉ giao hàng</label>
                                <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500" placeholder="Số nhà, Tên đường..." />
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
                            <button onClick={() => setIsAddOpen(false)} className="px-5 py-2.5 text-slate-400 hover:text-white font-medium text-sm transition-colors">Hủy</button>
                            <button onClick={() => { setIsAddOpen(false); toast.success('Đã lưu khách hàng thành công!'); }} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors shadow-lg shadow-emerald-600/20 font-medium text-sm flex items-center gap-2">Lưu thông tin</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
