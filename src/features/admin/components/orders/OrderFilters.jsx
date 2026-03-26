import React from 'react';
import { Search, CalendarDays, Filter } from 'lucide-react';

export default function OrderFilters({ search, setSearch, filterDate, setFilterDate, filterStatus, setFilterStatus }) {
    return (
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
                    <option value="delivering">Đang giao</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="debt">Ghi nợ</option>
                    <option value="partial_paid">Thanh toán 1 phần</option>
                    <option value="cancelled">Đã hủy</option>
                </select>
            </div>
        </div>
    );
}
