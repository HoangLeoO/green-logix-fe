import React from 'react';
import { Search } from 'lucide-react';

export default function CustomerFilters({ searchTerm, setSearchTerm }) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom duration-500">
            <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-500" />
                </div>
                <input
                    type="text"
                    placeholder="Tìm khách hàng (Tên, SĐT, Mã KH)..."
                    className="block w-full pl-11 pr-4 py-3.5 border border-slate-700 bg-slate-950/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    );
}
