import React from 'react';
import { ShoppingBag, Clock, CheckCircle2 } from 'lucide-react';

export default function OrderStats({ totalElements, ordersList, pageNumber }) {
    const stats = [
        { label: 'Tổng đơn', value: totalElements, icon: ShoppingBag, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
        { label: 'Chờ xử lý', value: ordersList.filter(o => o.status === 'pending').length + (pageNumber > 0 ? '...' : ''), icon: Clock, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
        { label: 'Đã thanh toán', value: ordersList.filter(o => o.status === 'paid').length + (pageNumber > 0 ? '...' : ''), icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    ];

    return (
        <div className="grid grid-cols-3 gap-4 mb-6 animate-in fade-in slide-in-from-bottom duration-500">
            {stats.map((stat) => (
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
    );
}
