import React, { useState, useEffect } from 'react';
import {
    Settings as SettingsIcon,
    User,
    MessageSquare,
    Bell,
    Shield,
    LogOut,
    Save,
    Smartphone,
    Copy,
    Loader2,
    CreditCard
} from 'lucide-react';
import { toast } from 'sonner';
import settingService from '../../../api/services/setting';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);

    // Settings State
    const [settings, setSettings] = useState({
        zalo_header: '',
        zalo_footer: '',
        email_smtp_host: '',
        email_smtp_port: '',
        email_username: '',
        email_app_password: '',
        email_admin_report: '',
        bank_code: 'VCB',
        bank_account: '',
        bank_account_name: '',
        vnp_tmn_code: '',
        vnp_hash_secret: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await settingService.getAll();
            const settingsMap = {};
            response.data.forEach(s => {
                settingsMap[s.key] = s.value;
            });
            setSettings(prev => ({ ...prev, ...settingsMap }));
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            toast.error('Không thể tải cấu hình hệ thống');
        } finally {
            setInitializing(false);
        }
    };

    const handleInputChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await settingService.update(settings);
            toast.success('Đã lưu cấu hình thành công!');
        } catch (error) {
            console.error('Save failed:', error);
            toast.error('Lỗi khi lưu cấu hình');
        } finally {
            setLoading(false);
        }
    };

    const copyVariable = (variable) => {
        navigator.clipboard.writeText(variable);
        toast.success(`Đã copy biến ${variable} vào khay nhớ tạm`);
    };

    const qrPreviewUrl = settings.bank_account
        ? `https://img.vietqr.io/image/${settings.bank_code}-${settings.bank_account}-compact2.png?amount=100000&addInfo=THANH_TOAN_THU_NGHIEM&accountName=${encodeURIComponent(settings.bank_account_name)}`
        : null;

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
                                onClick={() => setActiveTab('payment')}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm whitespace-nowrap ${activeTab === 'payment'
                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                    }`}
                            >
                                <CreditCard className="w-5 h-5 flex-shrink-0" />
                                <span>Cấu hình Thanh toán</span>
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

                            <button
                                onClick={() => setActiveTab('vnpay')}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm whitespace-nowrap ${activeTab === 'vnpay'
                                    ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-sm'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                    }`}
                            >
                                <div className="w-5 h-5 flex items-center justify-center font-bold text-[10px] border-2 border-current rounded">VP</div>
                                <span>VNPay Sandbox</span>
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
                <div className="lg:w-3/4 relative">
                    {initializing && (
                        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                        </div>
                    )}

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
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-600/20"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TAB: PAYMENT CONFIG */}
                    {activeTab === 'payment' && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-300">
                            <div className="p-6 border-b border-slate-800">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                                    <CreditCard className="w-5 h-5 text-amber-400" />
                                    Cấu hình QR Thanh toán (VietQR)
                                </h2>
                                <p className="text-sm text-slate-400">
                                    Thiết lập tài khoản ngân hàng của bạn để hệ thống tự động sinh mã QR nộp tiền nhanh cho khách hàng.
                                </p>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-slate-400 text-xs uppercase tracking-wider">Ngân hàng thụ hưởng</label>
                                            <select
                                                value={settings.bank_code}
                                                onChange={(e) => handleInputChange('bank_code', e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                                            >
                                                <option value="VCB">Vietcombank (VCB)</option>
                                                <option value="TCB">Techcombank (TCB)</option>
                                                <option value="MB">MB Bank (MB)</option>
                                                <option value="ICB">VietinBank (ICB)</option>
                                                <option value="BIDV">BIDV</option>
                                                <option value="ACB">ACB</option>
                                                <option value="VBA">Agribank</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-slate-400 text-xs uppercase tracking-wider">Số tài khoản</label>
                                            <input
                                                type="text"
                                                value={settings.bank_account}
                                                onChange={(e) => handleInputChange('bank_account', e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-mono"
                                                placeholder="Nhập số tài khoản..."
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-slate-400 text-xs uppercase tracking-wider">Tên chủ tài khoản (Không dấu)</label>
                                            <input
                                                type="text"
                                                value={settings.bank_account_name}
                                                onChange={(e) => handleInputChange('bank_account_name', e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all uppercase"
                                                placeholder="E.G. NGUYEN VAN A"
                                            />
                                            <p className="text-[10px] text-slate-500 italic mt-1">* Lưu ý: Tên tài khoản nên viết hoa, không dấu để hiển thị QR chính xác.</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Ảnh xem trước hiển thị (Mock 100k)</div>
                                        <div className="bg-white p-3 rounded-2xl shadow-xl relative group">
                                            <div className="absolute inset-0 bg-amber-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            {qrPreviewUrl ? (
                                                <img
                                                    src={qrPreviewUrl}
                                                    alt="QR Preview"
                                                    className="w-40 h-40 object-contain relative z-10"
                                                />
                                            ) : (
                                                <div className="w-40 h-40 flex items-center justify-center text-slate-300 text-[10px] font-bold uppercase p-4">
                                                    Nhập STK để xem trước QR
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-6 space-y-1">
                                            <div className="text-amber-400 font-mono font-bold text-sm uppercase">{settings.bank_code} • {settings.bank_account || 'N/A'}</div>
                                            <div className="text-white text-[10px] font-bold uppercase opacity-60">{settings.bank_account_name || 'CHƯA NHẬP TÊN'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end">
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-amber-600/20"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    Lưu cấu hình ngân hàng
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
                                                value={settings.zalo_header}
                                                onChange={(e) => handleInputChange('zalo_header', e.target.value)}
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
                                                value={settings.zalo_footer}
                                                onChange={(e) => handleInputChange('zalo_footer', e.target.value)}
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
                                                    {(settings.zalo_header || '').replace('[Tên Khách Hàng]', 'Bếp Cơm Mười Khó')}
                                                    {'\n\n'}
                                                    📦 Phiếu giao: ORD-099{'\n'}
                                                    - 1.5kg Củ Hành...{'\n'}
                                                    - 5kg Gạo...{'\n\n'}
                                                    💰 Tổng: 8.400.000đ{'\n\n'}
                                                    {settings.zalo_footer}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end">
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-blue-600/20"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    Lưu cấu hình Zalo
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TAB: NOTIFICATIONS */}
                    {activeTab === 'notifications' && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-300">
                            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-emerald-400" />
                                    Cấu hình Thông báo Email
                                </h2>
                            </div>

                            <div className="p-6 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-400">SMTP Host</label>
                                        <input
                                            type="text"
                                            value={settings.email_smtp_host}
                                            onChange={(e) => handleInputChange('email_smtp_host', e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                            placeholder="e.g. smtp.gmail.com"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-400">SMTP Port</label>
                                        <input
                                            type="text"
                                            value={settings.email_smtp_port}
                                            onChange={(e) => handleInputChange('email_smtp_port', e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                                            placeholder="e.g. 587"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-400">Email gửi (Username)</label>
                                        <input
                                            type="email"
                                            value={settings.email_username}
                                            onChange={(e) => handleInputChange('email_username', e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-400">Mật khẩu ứng dụng (App Password)</label>
                                        <input
                                            type="password"
                                            value={settings.email_app_password}
                                            onChange={(e) => handleInputChange('email_app_password', e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-400">Email nhận báo cáo (Admin)</label>
                                        <input
                                            type="email"
                                            value={settings.email_admin_report}
                                            onChange={(e) => handleInputChange('email_admin_report', e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                            placeholder="owner@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-emerald-100 font-medium">Lưu ý về bảo mật</p>
                                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                            Nếu sử dụng Gmail, bạn cần bật Xác thực 2 lớp và tạo <strong>Mật khẩu ứng dụng</strong> để hệ thống có thể gửi mail an toàn.
                                            Không nên sử dụng mật khẩu chính của tài khoản.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end">
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-600/20"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    Lưu cấu hình Email
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TAB: VNPAY CONFIG */}
                    {activeTab === 'vnpay' && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-300">
                            <div className="p-6 border-b border-slate-800">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-[10px] font-black italic">VNP</div>
                                    Cấu hình VNPay Gateway
                                </h2>
                                <p className="text-sm text-slate-400">
                                    Tích hợp cổng thanh toán VNPay để tự động hóa quy trình nhận tiền từ khách hàng.
                                </p>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-400">Website ID (vnp_TmnCode)</label>
                                        <input
                                            type="text"
                                            value={settings.vnp_tmn_code}
                                            onChange={(e) => handleInputChange('vnp_tmn_code', e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-mono"
                                            placeholder="e.g. 2QXG8Q0C"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-400">Secret Key (vnp_HashSecret)</label>
                                        <input
                                            type="password"
                                            value={settings.vnp_hash_secret}
                                            onChange={(e) => handleInputChange('vnp_hash_secret', e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
                                    <h4 className="text-sm font-bold text-blue-400 mb-2">Thông tin Sandbox (Dùng để test)</h4>
                                    <ul className="text-xs text-slate-400 space-y-2 list-disc ml-4">
                                        <li>Mã TmnCode mặc định: <code className="text-blue-300">2QXG8Q0C</code></li>
                                        <li>Thẻ test: <strong>9704198526191432198</strong></li>
                                        <li>Tên chủ thẻ: <strong>NGUYEN VAN A</strong></li>
                                        <li>Ngày phát hành: <strong>07/15</strong></li>
                                        <li>Mật khẩu OTP: <strong>123456</strong></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end">
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-red-600/20"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    Lưu cấu hình VNPay
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
