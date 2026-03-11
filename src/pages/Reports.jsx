import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    CalendarDays, Download, FileText, TrendingUp, CreditCard, ShoppingBag,
    ExternalLink, FileSpreadsheet, Activity
} from 'lucide-react';

// --- MOCK DATA ---
const revenueData = [
    { name: '10/10', revenue: 2100000, debt: 500000 },
    { name: '11/10', revenue: 1800000, debt: 200000 },
    { name: '12/10', revenue: 3200000, debt: 800000 },
    { name: '13/10', revenue: 2800000, debt: 450000 },
    { name: '14/10', revenue: 4500000, debt: 1200000 },
    { name: '15/10', revenue: 3900000, debt: 600000 },
    { name: '16/10', revenue: 5100000, debt: 950000 },
];

const topProducts = [
    { name: 'Cà chua Đà Lạt', value: 850, fill: '#34d399' }, // Emerald-400
    { name: 'Cải ngọt', value: 620, fill: '#6EE7B7' }, // Emerald-300
    { name: 'Hành tây', value: 480, fill: '#818cf8' }, // Indigo-400
    { name: 'Khoai tây', value: 390, fill: '#fcd34d' }, // Amber-300
    { name: 'Rau muống', value: 310, fill: '#94a3b8' }, // Slate-400
];

const debtList = [
    { id: 1, customer: 'Bếp Cơm Mười Khó', amount: 8400000, lastOrder: '15/10/2023', status: 'Nguy hiểm' },
    { id: 2, customer: 'Chú Tư (Q.4)', amount: 3200000, lastOrder: '14/10/2023', status: 'Cảnh báo' },
    { id: 3, customer: 'Cô Ba (Chợ Bến Thành)', amount: 1500000, lastOrder: '16/10/2023', status: 'Trong hạn' },
    { id: 4, customer: 'Chị Lan (Bình Thạnh)', amount: 450000, lastOrder: '12/10/2023', status: 'Trong hạn' },
];

export default function Reports() {
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const [isExporting, setIsExporting] = useState(false);

    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    const formatNumber = (value) => new Intl.NumberFormat('vi-VN').format(value);

    const handleExport = (type) => {
        setIsExporting(true);
        // Giả lập delay sinh file
        setTimeout(() => {
            setIsExporting(false);
            alert(`Đã xuất báo cáo định dạng [${type}] thành công! File đã được lưu. (Mock UI)`);
        }, 2000);
    };

    // Custom Tooltip cho PieChart
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
                    <p className="text-white font-medium">{payload[0].name}</p>
                    <p className="text-emerald-400 text-sm font-bold mt-1">
                        Đã bán: <span className="font-mono text-white text-base ml-1">{payload[0].value}</span> kg
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-4 md:p-8 font-sans pb-24 md:pb-8 flex flex-col gap-6">

            {/* ---------------- TRUY VẤN & HEADER ---------------- */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm p-5 md:p-6">
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <span className="w-2 h-8 bg-indigo-500 rounded-full inline-block animate-pulse"></span>
                            Báo cáo & Thống kê
                        </h1>
                        <p className="text-slate-400 mt-1 ml-5 text-sm">Phân tích chuyên sâu về Doanh thu, Công nợ và Mặt hàng</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <div className="flex items-center w-full sm:w-auto">
                            <CalendarDays className="w-4 h-4 text-slate-500 ml-3 mr-2" />
                            <input
                                type="date"
                                className="bg-transparent border-none text-sm text-slate-300 focus:ring-0 cursor-pointer p-2 w-full [color-scheme:dark]"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                        </div>
                        <span className="text-slate-600 hidden sm:inline px-2">Đến</span>
                        <div className="flex items-center w-full sm:w-auto relative group">
                            <CalendarDays className="w-4 h-4 text-slate-500 ml-3 mr-2 group-focus-within:text-indigo-400" />
                            <input
                                type="date"
                                className="bg-transparent border-none text-sm text-slate-300 focus:ring-0 cursor-pointer p-2 w-full [color-scheme:dark]"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                        </div>
                        <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border border-indigo-500">
                            Lọc Dữ Liệu
                        </button>
                    </div>
                </div>
            </div>

            {/* ---------------- TỔNG QUAN NUMBERS ---------------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {/* DOANH THU */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full group-hover:bg-emerald-500/10 transition-colors pointer-events-none"></div>
                    <div className="flex items-start justify-between">
                        <div className="bg-emerald-500/10 p-2.5 rounded-lg text-emerald-400 border border-emerald-500/20 mb-4 inline-block">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm font-medium mb-1 truncate">Tổng Doanh Thu (Đã thu)</p>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{formatCurrency(18600000)}</h3>
                    <p className="text-xs text-emerald-400 mt-2 font-medium flex items-center gap-1.5"><TrendingUp className="w-3 h-3" /> +15% so với kỳ trước</p>
                </div>

                {/* CÔNG NỢ */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full group-hover:bg-red-500/10 transition-colors pointer-events-none"></div>
                    <div className="flex items-start justify-between">
                        <div className="bg-red-500/10 p-2.5 rounded-lg text-red-400 border border-red-500/20 mb-4 inline-block">
                            <CreditCard className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm font-medium mb-1 truncate">Tổng Công Nợ Kéo Dài</p>
                    <h3 className="text-2xl font-bold text-red-400 tracking-tight">{formatCurrency(13550000)}</h3>
                    <p className="text-xs text-slate-500 mt-2 font-medium bg-slate-800 w-max px-2.5 py-1 rounded inline-block">Khá cao, cần nhắc nợ</p>
                </div>

                {/* LỢI NHUẬN */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full group-hover:bg-indigo-500/10 transition-colors pointer-events-none"></div>
                    <div className="flex items-start justify-between">
                        <div className="bg-indigo-500/10 p-2.5 rounded-lg text-indigo-400 border border-indigo-500/20 mb-4 inline-block">
                            <Activity className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm font-medium mb-1 truncate">Lợi nhuận gộp (Ước tính)</p>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{formatCurrency(4650000)}</h3>
                    <p className="text-xs text-indigo-400 mt-2 font-medium flex items-center gap-1.5">Biên độ LN: ~25%</p>
                </div>

                {/* LƯỢNG HÀNG */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full group-hover:bg-amber-500/10 transition-colors pointer-events-none"></div>
                    <div className="flex items-start justify-between">
                        <div className="bg-amber-500/10 p-2.5 rounded-lg text-amber-400 border border-amber-500/20 mb-4 inline-block">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm font-medium mb-1 truncate">Tổng khối lượng xuất kho</p>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{formatNumber(2650)} <span className="text-sm text-slate-500 font-normal">kg</span></h3>
                    <p className="text-xs text-slate-500 mt-2 font-medium">Bao gồm Củ quả + Rau lá + Nấm</p>
                </div>
            </div>

            {/* ---------------- BIỂU ĐỒ BÁO CÁO KẾP ---------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Biểu đồ Doanh Thu / Nợ (Bar Chart) */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl shadow-sm flex flex-col h-full min-h-[400px]">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                        <FileText className="w-5 h-5 text-indigo-400" />
                        <span>Tương quan Doanh thu & Công Nợ</span>
                    </h2>
                    <div className="flex-1 w-full h-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={revenueData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" tickMargin={10} axisLine={false} tickLine={false} />
                                <YAxis
                                    stroke="#64748b"
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(val) => `${val / 1000000}M`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }}
                                    formatter={(value, name) => [formatCurrency(value), name === 'revenue' ? 'Thực thu' : 'Ghi nợ']}
                                    cursor={{ fill: '#1e293b', opacity: 0.4 }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                                {/* 2 cột màu khác biệt cho Thực thu và Ghi nợ */}
                                <Bar dataKey="revenue" name="Thực thu" stackId="a" fill="#34d399" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="debt" name="Ghi nợ" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Biểu đồ Sản phẩm Bán chạy (Pie Chart) */}
                <div className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl shadow-sm flex flex-col h-full min-h-[400px]">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                        <ShoppingBag className="w-5 h-5 text-amber-500" />
                        Top 5 Rau củ Bán chạy nhất
                    </h2>
                    <div className="flex-1 w-full flex justify-center items-center -mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={topProducts}
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {topProducts.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Custom Legend */}
                    <div className="space-y-3 mt-4 overflow-y-auto max-h-[160px] pr-2 no-scrollbar">
                        {topProducts.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-800 pb-2 last:border-0">
                                <div className="flex items-center gap-2 text-slate-300 font-medium">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                                    {item.name}
                                </div>
                                <div className="font-mono text-slate-400">{item.value} kg</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* ---------------- DANH SÁCH CHI TIẾT & IMPORT/EXPORT ---------------- */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 md:p-6 border-b border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-red-400" />
                            Chi tiết các khoản Công nợ Báo Động
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">Danh sách đối chiếu các khoản nợ lớn, cần lưu tâm.</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => handleExport('EXCEL')}
                            disabled={isExporting}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isExporting ? <span className="animate-spin text-slate-400">🌀</span> : <FileSpreadsheet className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />}
                            <span className="hidden sm:inline">Xuất Excel (Kế toán)</span>
                        </button>

                        <button
                            onClick={() => handleExport('PDF')}
                            disabled={isExporting}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isExporting ? <span className="animate-spin text-slate-400">🌀</span> : <FileText className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />}
                            <span className="hidden sm:inline">In PDF (Lưu trữ)</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto w-full max-h-[400px] overflow-y-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="text-xs uppercase bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
                            <tr>
                                <th className="px-5 py-4 font-semibold text-slate-400">Tên Đối Tác Mắc Nợ</th>
                                <th className="px-5 py-4 font-semibold text-slate-400">GD Có Nợ Cuối Cùng</th>
                                <th className="px-5 py-4 font-semibold text-center text-slate-400">Đánh giá rủi ro</th>
                                <th className="px-5 py-4 font-semibold text-right text-slate-400">Số dư nợ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 relative">
                            {isExporting && (
                                <tr className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] z-20 flex justify-center items-center">
                                    <td className="w-full text-center py-10 font-medium text-indigo-400 flex flex-col items-center">
                                        <span className="animate-spin text-4xl mb-4 text-indigo-500 shadow-xl">🌀</span>
                                        Hệ thống đang trích xuất dữ liệu, vui lòng không tắt trình duyệt...
                                    </td>
                                </tr>
                            )}

                            {debtList.map((debtInfo) => (
                                <tr key={`debt-${debtInfo.id}`} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-5 py-4 font-bold text-slate-200">{debtInfo.customer}</td>
                                    <td className="px-5 py-4 text-slate-400">{debtInfo.lastOrder} <span className="text-xs text-slate-500 ml-1">(Bởi: Nhân viên kho)</span></td>
                                    <td className="px-5 py-4 text-center">
                                        {debtInfo.status === 'Nguy hiểm' && <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2.5 py-1 rounded text-xs font-bold uppercase track-wide">Mức đỏ (Cần chốt)</span>}
                                        {debtInfo.status === 'Cảnh báo' && <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-1 rounded text-xs font-bold uppercase track-wide">Theo dõi</span>}
                                        {debtInfo.status === 'Trong hạn' && <span className="bg-slate-800 text-slate-400 border border-slate-700 px-2.5 py-1 rounded text-xs font-bold uppercase track-wide">An toàn</span>}
                                    </td>
                                    <td className="px-5 py-4 font-bold text-red-400 text-right tracking-wide flex justify-end items-center gap-2">
                                        {formatCurrency(debtInfo.amount)}
                                        <button className="text-slate-500 hover:text-indigo-400 transition-colors ml-2" title="Gửi Zalo Nhắc Nợ">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
