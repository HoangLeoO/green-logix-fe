import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Users, Settings, LogOut, Leaf, Store, Package, LineChart } from 'lucide-react';
import { useConfirmStore } from '../store/useConfirmStore';

export default function Layout() {
    const navigate = useNavigate();
    const { showConfirm } = useConfirmStore();

    const handleLogout = () => {
        showConfirm({
            title: 'Đăng xuất',
            message: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
            confirmText: 'Đăng xuất',
            cancelText: 'Hủy',
            type: 'warning',
            onConfirm: () => {
                navigate('/login');
            }
        });
    };

    const navItems = [
        { name: 'Tổng quan', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5 mb-1 md:mb-0" /> },
        { name: 'Sản phẩm', path: '/products', icon: <Package className="w-5 h-5 mb-1 md:mb-0" /> },
        { name: 'Tạo đơn', path: '/pos', icon: <Store className="w-5 h-5 mb-1 md:mb-0" /> },
        { name: 'Đơn hàng', path: '/orders', icon: <ShoppingCart className="w-5 h-5 mb-1 md:mb-0" /> },
        { name: 'Khách hàng', path: '/customers', icon: <Users className="w-5 h-5 mb-1 md:mb-0" /> },
        { name: 'Báo cáo', path: '/reports', icon: <LineChart className="w-5 h-5 mb-1 md:mb-0" /> },
        { name: 'Cài đặt', path: '/settings', icon: <Settings className="w-5 h-5 mb-1 md:mb-0" /> },
    ];

    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">

            {/* Sidebar (Desktop) */}
            <aside className="w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900/50 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <Leaf className="w-6 h-6 text-emerald-500 mr-2" />
                    <span className="text-xl font-bold text-white tracking-tight">GreenLogix</span>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 shadow-sm shadow-emerald-500/10'
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
            <main className="flex-1 min-w-0 overflow-y-auto relative pb-20 md:pb-0">
                <div className="max-w-7xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Navigation (Visible only on small screens) */}
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
                            <span className="text-[10px] font-medium leading-none">{item.name}</span>
                        </NavLink>
                    ))}
                </div>
            </nav>

        </div>
    );
}
