import React from 'react';
import { RefreshCw, UserPlus } from 'lucide-react';

export default function CustomerHeader({ fetchCustomers, isLoading, handleOpenAdd }) {
    return (
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="animate-in fade-in slide-in-from-left duration-500">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="w-2 h-8 bg-emerald-500 rounded-full inline-block"></span>
                    Quản lý Khách hàng
                </h1>
                <p className="text-slate-400 mt-1 ml-5">Danh sách đối tác và thông tin liên lạc</p>
            </div>

            <div className="flex gap-3 animate-in fade-in slide-in-from-right duration-500">
                <button
                    onClick={fetchCustomers}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700 active:scale-95"
                    title="Tải lại trang"
                >
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                    <UserPlus className="w-5 h-5" />
                    Khách hàng mới
                </button>
            </div>
        </div>
    );
}
