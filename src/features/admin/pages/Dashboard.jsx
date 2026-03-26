import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    Package,
    CreditCard,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Loader2
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import dashboardService from '../../../api/services/dashboard';
import { STATUS_CONFIG } from '../components/orders/OrderConstants';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updateTime, setUpdateTime] = useState(new Date().toLocaleTimeString());

    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await dashboardService.getStats();
            setStats(data);
            setUpdateTime(new Date().toLocaleTimeString());
        } catch (error) {
            console.error('Lỗi khi tải thống kê:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading && !stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                <p className="text-slate-400 font-medium">Đang đồng bộ dữ liệu hệ thống...</p>
            </div>
        );
    }

    // Các thành phần tăng trưởng
    const GrowthBadge = ({ value }) => (
        <div className={`flex items-center text-sm font-medium ${value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {value >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
            <span>{value >= 0 ? '+' : ''}{value.toFixed(1)}% so với hôm qua</span>
        </div>
    );

    return (
        <div className="p-4 md:p-8 font-sans pb-24 md:pb-8">

            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <span className="w-2 h-8 bg-emerald-500 rounded-full inline-block"></span>
                        Tổng quan Hệ thống
                    </h1>
                    <p className="text-slate-400 mt-1 ml-5">Nắm bắt nhanh tình hình kinh doanh hôm nay</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                    <button
                        onClick={fetchStats}
                        className="hover:rotate-180 transition-transform duration-500"
                        title="Làm mới dữ liệu"
                    >
                        <Clock className="w-5 h-5 text-emerald-400" />
                    </button>
                    <span className="text-sm font-medium">Cập nhật lúc: <span className="text-emerald-300">{updateTime} (Real-time)</span></span>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Card 1: Tổng đơn hôm nay */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-1">Tổng đơn hôm nay</p>
                            <h3 className="text-3xl font-bold text-white mb-2">{stats.totalOrdersToday}<span className="text-sm text-slate-500 font-normal ml-1">đơn</span></h3>
                            <GrowthBadge value={stats.ordersGrowth} />
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                            <Package className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Card 2: Tổng doanh thu */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-1">Doanh thu hôm nay</p>
                            <h3 className="text-3xl font-bold text-emerald-400 mb-2">
                                {new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(stats.totalRevenueToday)}
                                <span className="text-sm text-slate-500 font-normal ml-1">VNĐ</span>
                            </h3>
                            <GrowthBadge value={stats.revenueGrowth} />
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Card 3: Số lượng đơn nợ (Công nợ) */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-red-500/50 transition-colors">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl"></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-1">Đơn nợ mới trong ngày</p>
                            <h3 className="text-3xl font-bold text-red-400 mb-2">{stats.debtOrdersToday}<span className="text-sm text-slate-500 font-normal ml-1">đơn</span></h3>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Cần thu hồi sớm
                            </p>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20">
                            <CreditCard className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Charts Section */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                            Biến động doanh thu 7 ngày
                        </h2>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.weeklyStats} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                                <YAxis
                                    stroke="#64748b"
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => v >= 1000000 ? `${v / 1000000}M` : v}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f1f5f9' }}
                                    formatter={(v, n) => [n === 'revenue' ? formatCurrency(v) : v, n === 'revenue' ? 'Doanh thu' : 'Số đơn']}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={3} dot={{ r: 4, fill: '#34d399', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Customers */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-400" />
                            Top khách hàng chi tiêu
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {stats.topCustomers.map((customer, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm border ${idx === 0 ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' : 'bg-slate-800 text-emerald-400 border-slate-700'}`}>
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-200">{customer.name}</h4>
                                        <p className="text-xs text-slate-500">{customer.orders} đơn hàng</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-emerald-400">{formatCurrency(customer.totalSpent)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-800 border-dashed">
                        Xem tất cả khách hàng
                    </button>
                </div>

                {/* Recent Orders List */}
                <div className="lg:col-span-3 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Package className="w-5 h-5 text-indigo-400" />
                            Các giao dịch gần nhất
                        </h2>
                        <button className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                            Xem tất cả
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="text-xs uppercase bg-slate-800/50 text-slate-300 border-y border-slate-800/50">
                                <tr>
                                    <th className="px-4 py-3 font-semibold rounded-l-lg">Mã đơn</th>
                                    <th className="px-4 py-3 font-semibold">Khách hàng</th>
                                    <th className="px-4 py-3 font-semibold text-right">Tổng cộng</th>
                                    <th className="px-4 py-3 font-semibold text-center">Trạng thái</th>
                                    <th className="px-4 py-3 font-semibold text-right rounded-r-lg">Ngày tạo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-4 py-4 font-medium text-slate-300 group-hover:text-emerald-400">{order.id}</td>
                                        <td className="px-4 py-4 text-slate-200">{order.customerName}</td>
                                        <td className="px-4 py-4 text-right font-medium text-white">{formatCurrency(order.amount)}</td>
                                        <td className="px-4 py-4 text-center text-xs">
                                            {(() => {
                                                const cfg = STATUS_CONFIG[order.status];
                                                return cfg
                                                    ? <span className={`px-2.5 py-1 rounded-full border font-semibold ${cfg.color}`}>{cfg.label}</span>
                                                    : <span className="px-2.5 py-1 rounded-full border border-slate-700 text-slate-400">{order.status}</span>;
                                            })()}
                                        </td>
                                        <td className="px-4 py-4 text-right text-xs text-slate-500">{order.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
