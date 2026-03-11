import React, { useState } from 'react';
import {
    Settings as SettingsIcon,
    User,
    MessageSquare,
    Bell,
    Shield,
    LogOut,
    Save,
    Smartphone,
    Copy
} from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');

    // Zalo Message Template State
    const [zaloHeader, setZaloHeader] = useState('Kính gửi anh/chị [Tên Khách Hàng],');
    const [zaloFooter, setZaloFooter] = useState('Trân trọng cảm ơn. Vui lòng thanh toán vào STK: 123456789 - VCB - Tên Chủ TK');

    const handleSave = () => {
        toast.success('Đã lưu cấu hình thành công!');
    };

    const copyVariable = (variable) => {
        navigator.clipboard.writeText(variable);
        toast.success(`Đã copy biến ${variable} vào khay nhớ tạm`);
    };

    return (
        <div className="p-4 md:p-8 font-sans pb-24 md:pb-8 flex flex-col h-full">

            {/* ---------------- HEADER ---------------- */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="w-2 h-8 bg-emerald-500 rounded-full inline-block"></span>
                    Cài đặt Hệ thống
                </h1>
                <p className="text-slate-400 mt-1 ml-5 text-sm">Quản lý tài khoản, tích hợp và các thiết lập chung</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 flex-1">

                {/* ---------------- SIDEBAR (TABS) ---------------- */}
                <div className="lg:w-1/4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm p-3 overflow-hidden">
                        <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm whitespace-nowrap ${activeTab === 'profile'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                    }`}
                            >
                                <User className="w-5 h-5 flex-shrink-0" />
                                <span>Tài khoản cá nhân</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('zalo')}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm whitespace-nowrap ${activeTab === 'zalo'
                                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                    }`}
                            >
                                <MessageSquare className="w-5 h-5 flex-shrink-0" />
                                <span>Mẫu tin nhắn Zalo</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('notifications')}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm whitespace-nowrap ${activeTab === 'notifications'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                    }`}
                            >
                                <Bell className="w-5 h-5 flex-shrink-0" />
                                <span>Thông báo Email</span>
                            </button>

                            <div className="h-px bg-slate-800 my-2 lg:block hidden"></div>

                            <button className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm text-slate-500 hover:text-white hover:bg-slate-800 lg:flex hidden">
                                <Shield className="w-5 h-5 flex-shrink-0" />
                                <span>Bảo mật thiết bị</span>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* ---------------- MAIN CONTENT AREA ---------------- */}
                <div className="lg:w-3/4">

                    {/* TAB: PROFILE */}
                    {activeTab === 'profile' && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-300">
                            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <User className="w-5 h-5 text-emerald-400" />
                                    Thông tin Tài khoản
                                </h2>
                            </div>

                            <div className="p-6 space-y-8">
                                {/* Thay đổi Avatar (Mock) */}
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-500 overflow-hidden relative group cursor-pointer">
                                        <User className="w-10 h-10" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <span className="text-xs text-white font-medium">Thay đổi</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">Quản lý Lạc Vườn</h3>
                                        <p className="text-slate-400 text-sm">admin@greenlogix.com</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-400">Tên hiển thị</label>
                                        <input
                                            type="text"
                                            defaultValue="Lạc Vườn Chợ Mới"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-400">Số điện thoại Admin</label>
                                        <input
                                            type="text"
                                            defaultValue="0988 888 888"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-400">Đổi mật khẩu mới</label>
                                        <input
                                            type="password"
                                            placeholder="Nhập mật khẩu mới nếu muốn thay đổi..."
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end">
                                <button onClick={handleSave} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-600/20">
                                    <Save className="w-5 h-5" />
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TAB: ZALO INTEGRATION */}
                    {activeTab === 'zalo' && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-300">
                            <div className="p-6 border-b border-slate-800">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                                    <Smartphone className="w-5 h-5 text-blue-400" />
                                    Cấu trúc Tin nhắn Send-to-Zalo
                                </h2>
                                <p className="text-sm text-slate-400">
                                    Phần này cho phép bạn định dạng mẫu tin nhắn (Header & Footer) mà hệ thống tự động sinh ra trước khi bạn gửi qua Zalo cho các chủ quán ăn.
                                    Phần nội dung <strong>Chi tiết đơn</strong> ở giữa sẽ được hệ thống sinh tự động dựa trên hóa đơn.
                                </p>
                            </div>

                            <div className="p-6 space-y-6">

                                {/* Available Variables */}
                                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                                    <h4 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Các biến số hỗ trợ (Bấm để copy)</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['[Tên Khách Hàng]', '[Mã Đơn]', '[Tổng Tiền]', '[Ngày Giao]', '[Công Nợ Cũ]'].map(v => (
                                            <button
                                                key={v}
                                                onClick={() => copyVariable(v)}
                                                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-mono px-3 py-1.5 rounded-lg border border-slate-700 hover:border-blue-500/30 transition-colors"
                                            >
                                                {v} <Copy className="w-3 h-3 text-slate-500" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Editor */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300 flex items-center justify-between">
                                                Phần mở đầu (Header)
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={zaloHeader}
                                                onChange={(e) => setZaloHeader(e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm leading-relaxed"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-slate-950/80 rounded-xl pointer-events-none flex items-center justify-center">
                                                    <span className="text-slate-500 text-sm italic border border-slate-700 bg-slate-900 px-3 py-1 rounded">-- Bảng Chi tiết Hóa Đơn Tự Động --</span>
                                                </div>
                                                <textarea rows={4} disabled className="w-full bg-slate-950 border border-slate-800 border-dashed rounded-xl px-4 py-3 text-slate-600 text-sm opacity-50"></textarea>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Phần kết thúc (Footer)</label>
                                            <textarea
                                                rows={4}
                                                value={zaloFooter}
                                                onChange={(e) => setZaloFooter(e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-sm leading-relaxed"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">* Thường dùng để ghi Số tài khoản ngân hàng hoặc lời cảm ơn.</p>
                                        </div>
                                    </div>

                                    {/* Preview Phone */}
                                    <div className="flex flex-col items-center">
                                        <h4 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2"><Smartphone className="w-4 h-4" /> Ảnh xem trước hiển thị</h4>
                                        <div className="w-[300px] bg-[#E2E8F0] h-[500px] rounded-[32px] border-8 border-slate-800 p-2 shadow-2xl relative overflow-hidden flex flex-col">
                                            {/* Status bar mock */}
                                            <div className="h-6 w-full flex justify-between items-center px-4 pt-1 mb-2">
                                                <span className="text-[10px] font-bold text-slate-800">12:00</span>
                                                <div className="flex gap-1">
                                                    <div className="w-3 h-3 bg-slate-800 rounded-full"></div>
                                                    <div className="w-4 h-3 bg-slate-800 rounded-sm"></div>
                                                </div>
                                            </div>
                                            {/* Zalo Chat UI */}
                                            <div className="bg-[#0068FF] rounded-t-xl px-4 py-3 text-white flex items-center justify-center shrink-0">
                                                <span className="font-bold text-sm">Bếp Cơm Mười Khó</span>
                                            </div>
                                            <div className="flex-1 bg-[#E2EEED] overflow-y-auto p-3 flex flex-col items-end">
                                                <div className="bg-white p-3 rounded-2xl rounded-tr-sm shadow-sm max-w-[85%] text-slate-800 text-[13px] leading-relaxed break-words whitespace-pre-wrap">
                                                    {zaloHeader.replace('[Tên Khách Hàng]', 'Bếp Cơm Mười Khó')}
                                                    {'\n\n'}
                                                    📦 Phiếu giao: ORD-099{'\n'}
                                                    - 1.5kg Củ Hành...{'\n'}
                                                    - 5kg Gạo...{'\n\n'}
                                                    💰 Tổng: 8.400.000đ{'\n\n'}
                                                    {zaloFooter}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end">
                                <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-blue-600/20">
                                    <Save className="w-5 h-5" />
                                    Lưu cấu hình Zalo
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TAB: NOTIFICATIONS */}
                    {activeTab === 'notifications' && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-300">
                            <div className="p-16 text-center">
                                <Bell className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                                <h2 className="text-xl font-bold text-white mb-2">Thông báo qua Email</h2>
                                <p className="text-slate-400">Hệ thống đang được cấu hình. Tính năng tự động gửi email tổng kết doanh thu cuối ngày sẽ sớm có mặt.</p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
