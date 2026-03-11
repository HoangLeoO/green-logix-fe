import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingBag, FileText, LogOut, Leaf } from 'lucide-react';
import { useConfirmStore } from '../store/useConfirmStore';

export default function CustomerLayout() {
    const navigate = useNavigate();
    const { showConfirm } = useConfirmStore();

    const handleLogout = () => {
        showConfirm({
            title: 'Trở về trang chủ',
            message: 'Bạn có muốn thoát khỏi phiên đăng nhập này không?',
            confirmText: 'Đăng xuất',
            cancelText: 'Huỷ',
            type: 'warning',
            onConfirm: () => {
                navigate('/login');
            }
        });
    };

    const navItems = [
        { name: 'Đặt Hàng', path: '/portal/shop', icon: <ShoppingBag className="w-5 h-5 mb-1 md:mb-0" /> },
        { name: 'Lịch Sử / Công Nợ', path: '/portal/history', icon: <FileText className="w-5 h-5 mb-1 md:mb-0" /> },
    ];

    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">

            {/* Sidebar (Desktop) */}
            <aside className="w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900/80 hidden md:flex flex-col shadow-2xl z-10 w-64 fixed h-full relative">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <Leaf className="w-6 h-6 text-emerald-500 mr-2" />
                    <span className="text-xl font-bold text-white tracking-tight">Green<span className="text-emerald-500">Logix</span></span>
                </div>

                {/* Customer Info */}
                <div className="p-5 border-b border-slate-800 bg-emerald-500/5">
                    <p className="text-xs text-slate-400 mb-1">Xin chào đối tác,</p>
                    <h3 className="text-base font-bold text-emerald-400 leading-tight">Bếp Cơm Mười Khó</h3>
                    <p className="text-xs text-slate-500 mt-1">Sỉ lớn - ID: CUST-004</p>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 font-medium'
                                }`
                            }
                        >
                            {item.icon}
                            <span className="text-[15px]">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium border border-transparent hover:border-red-500/20"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-[15px]">Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 overflow-y-auto relative pb-20 md:pb-0 relative z-0">
                {/* Top bar for mobile */}
                <div className="md:hidden h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sticky top-0 z-40">
                    <div className="flex items-center">
                        <Leaf className="w-5 h-5 text-emerald-500 mr-2" />
                        <span className="font-bold text-white">GreenLogix</span>
                    </div>
                    <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Bếp Cơm Mười Khó</div>
                </div>

                <div className="max-w-7xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
                <div className="flex justify-around items-center h-16 px-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center w-full h-full rounded-lg transition-colors py-1 ${isActive
                                    ? 'text-emerald-400'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`
                            }
                        >
                            {item.icon}
                            <span className="text-[10px] font-medium leading-none mt-1">{item.name}</span>
                        </NavLink>
                    ))}
                    <button
                        onClick={handleLogout}
                        className="flex flex-col items-center justify-center w-full h-full rounded-lg transition-colors py-1 text-slate-500 hover:text-red-400"
                    >
                        <LogOut className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-medium leading-none">Thoát</span>
                    </button>
                </div>
            </nav>

        </div>
    );
}
