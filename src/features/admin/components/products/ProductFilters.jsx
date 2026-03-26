import React from 'react';
import { Search, Layers, Filter } from 'lucide-react';

export default function ProductFilters({ searchTerm, setSearchTerm, selectedCategoryId, setSelectedCategoryId, categories }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6 animate-in fade-in slide-in-from-bottom duration-500">
            <div className="lg:col-span-8 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-500" />
                </div>
                <input
                    type="text"
                    placeholder="Tìm theo tên hoặc mã SKU..."
                    className="block w-full pl-12 pr-4 py-4 border border-slate-700 bg-slate-900 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="lg:col-span-4 relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Layers className="h-5 w-5 text-emerald-500" />
                </div>
                <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="block w-full pl-12 pr-10 py-4 border border-slate-700 bg-slate-900 rounded-2xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold appearance-none cursor-pointer group-hover:border-slate-600"
                >
                    <option value="">Tất cả danh mục</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Filter className="h-4 w-4 text-slate-500" />
                </div>
            </div>
        </div>
    );
}
