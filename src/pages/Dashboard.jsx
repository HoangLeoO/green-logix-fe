import React, { useState } from 'react';
import {
    TrendingUp,
    Package,
    CreditCard,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    Clock
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

// --- MOCK DATA ---
const revenueData = [
    { name: 'T2', revenue: 1200000, orders: 45 },
    { name: 'T3', revenue: 2100000, orders: 62 },
    { name: 'T4', revenue: 800000, orders: 30 },
    { name: 'T5', revenue: 1600000, orders: 50 },
    { name: 'T6', revenue: 2400000, orders: 75 },
    { name: 'T7', revenue: 3200000, orders: 110 },
    { name: 'CN', revenue: 4100000, orders: 140 },
];

const recentOrders = [
    { id: 'ORD-001', customer: 'Cô Ba (Chợ Bến Thành)', amount: 450000, status: 'completed', time: '10 phút trước' },
    { id: 'ORD-002', customer: 'Chú Tư (Q.4)', amount: 1200000, status: 'pending', time: '35 phút trước' },
    { id: 'ORD-003', customer: 'Nhà hàng chay Bồ Đề', amount: 850000, status: 'completed', time: '1 giờ trước' },
    { id: 'ORD-004', customer: 'Chị Lan (Bình Thạnh)', amount: 320000, status: 'debt', time: '2 giờ trước' },
    { id: 'ORD-005', customer: 'Bếp Cơm Mười Khó', amount: 2100000, status: 'completed', time: 'Hôm nay 08:30' },
];

const topCustomers = [
    { name: 'Bếp Cơm Mười Khó', totalSpent: 12500000, orders: 15 },
    { name: 'Nhà hàng chay Bồ Đề', totalSpent: 8400000, orders: 8 },
    { name: 'Cô Ba (Chợ Bến Thành)', totalSpent: 5200000, orders: 12 },
    { name: 'Chú Tư (Q.4)', totalSpent: 3100000, orders: 4 },
];

// --- COMPONENT ---
export default function Dashboard() {

    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

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
                <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-xl border border-slate-800">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-medium">Cập nhật lúc: <span className="text-emerald-300">Vừa xong (Real-time)</span></span>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Card 1: Tổng đơn hôm nay */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-1">Tổng số đơn hôm nay</p>
                            <h3 className="text-3xl font-bold text-white mb-2">142<span className="text-sm text-slate-500 font-normal ml-1">đơn</span></h3>
                            <div className="flex items-center text-sm font-medium text-emerald-400">
                                <ArrowUpRight className="w-4 h-4 mr-1" />
                                <span>+12.5% so với hôm qua</span>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                            <Package className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Card 2: Tổng doanh thu */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-1">Doanh thu hôm nay (Tạm tính)</p>
                            <h3 className="text-3xl font-bold text-emerald-400 mb-2">15.4M<span className="text-sm text-slate-500 font-normal ml-1">VNĐ</span></h3>
                            <div className="flex items-center text-sm font-medium text-emerald-400">
                                <ArrowUpRight className="w-4 h-4 mr-1" />
                                <span>+8.2% so với hôm qua</span>
                            </div>
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Card 3: Số lượng đơn nợ (Công nợ) */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-red-500/50 transition-colors">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all"></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-1">Đơn đang ghi nợ hôm nay</p>
                            <h3 className="text-3xl font-bold text-red-400 mb-2">18<span className="text-sm text-slate-500 font-normal ml-1">đơn (Hơn 4.2M)</span></h3>
                            <div className="flex items-center text-sm font-medium text-red-400">
                                <ArrowDownRight className="w-4 h-4 mr-1" />
                                <span>Cần nhắc nợ sớm</span>
                            </div>
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
                            Doanh thu 7 ngày gần đây
                        </h2>
                        <select className="bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 p-2 outline-none">
                            <option>Tuần này</option>
                            <option>Tháng này</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                                <YAxis
                                    stroke="#64748b"
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `${value / 1000000}M`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f1f5f9' }}
                                    formatter={(value, name) => [name === 'revenue' ? formatCurrency(value) : value, name === 'revenue' ? 'Doanh thu' : 'Số đơn']}
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
                            Khách mua nhiều nhất tuần
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {topCustomers.map((customer, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-emerald-400 border border-slate-700">
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
                            Đơn hàng gần đây nhất (Real-time)
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
                                    <th className="px-4 py-3 font-semibold text-right">Tổng tiền</th>
                                    <th className="px-4 py-3 font-semibold text-center">Trạng thái</th>
                                    <th className="px-4 py-3 font-semibold text-right rounded-r-lg">Thời gian</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order, idx) => (
                                    <tr key={order.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-4 py-4 font-medium px-4 py-4text-slate-300 group-hover:text-emerald-400">{order.id}</td>
                                        <td className="px-4 py-4 text-slate-200">{order.customer}</td>
                                        <td className="px-4 py-4 text-right font-medium text-white">{formatCurrency(order.amount)}</td>
                                        <td className="px-4 py-4 text-center">
                                            {order.status === 'completed' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Đã thanh toán</span>}
                                            {order.status === 'pending' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Chờ xử lý</span>}
                                            {order.status === 'debt' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">Ghi nợ</span>}
                                        </td>
                                        <td className="px-4 py-4 text-right text-xs">{order.time}</td>
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
