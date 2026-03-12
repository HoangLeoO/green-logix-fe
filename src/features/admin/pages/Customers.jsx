import React, { useState, useEffect, useCallback } from 'react';
import {
    Search,
    Phone,
    MapPin,
    Mail,
    History,
    X,
    UserPlus,
    Loader2,
    FileText,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { customerApi } from '../../../api/services/customer';
import { useConfirmStore } from '../../../store/useConfirmStore';
import { useDebounce } from '../../../hooks/useDebounce';
import CustomerModal from '../components/CustomerModal';

export default function Customers() {
    const [pageData, setPageData] = useState({
        content: [],
        totalPages: 0,
        totalElements: 0,
        number: 0,
        size: 10
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const showConfirm = useConfirmStore((state) => state.showConfirm);

    // Modal states
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch dữ liệu
    const fetchCustomers = useCallback(async (page = 0, size = 10, search = '', showLoading = true) => {
        if (showLoading) setIsLoading(true);
        try {
            const data = await customerApi.getAll({
                page,
                size,
                search: search ? search.trim() : ''
            });

            if (data && data.content) {
                setPageData(data);
            } else if (Array.isArray(data)) {
                setPageData({
                    content: data,
                    totalPages: 1,
                    totalElements: data.length,
                    number: 0,
                    size: 10
                });
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách khách hàng:", error);
            if (showLoading) toast.error("Lỗi kết nối Server. Vui lòng kiểm tra Backend!");
        } finally {
            if (showLoading) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCustomers(0, pageData.size, debouncedSearchTerm);
    }, [debouncedSearchTerm, fetchCustomers, pageData.size]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < (pageData?.totalPages || 0)) {
            fetchCustomers(newPage, pageData.size, debouncedSearchTerm);
        }
    };

    const handleOpenAdd = () => {
        setSelectedCustomer(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            if (!selectedCustomer) {
                // Thêm mới
                await customerApi.create(data);
                toast.success("Thêm khách hàng thành công!");
            } else {
                // Cập nhật
                await customerApi.update(selectedCustomer.id, data);
                toast.success("Cập nhật thông tin thành công!");
            }
            setIsModalOpen(false);
            fetchCustomers(pageData.number, pageData.size, debouncedSearchTerm, false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (customer) => {
        showConfirm({
            title: 'Xóa khách hàng',
            message: `Bạn có chắc chắn muốn xóa khách hàng "${customer.name}"? Hành động này không thể hoàn tác.`,
            confirmText: 'Xóa ngay',
            type: 'danger',
            onConfirm: async () => {
                try {
                    await customerApi.delete(customer.id);
                    toast.success(`Đã xóa khách hàng ${customer.name}`);
                    fetchCustomers(pageData.number, pageData.size, debouncedSearchTerm, false);
                } catch (error) {
                    toast.error("Không thể xóa khách hàng.");
                }
            }
        });
    };

    const customersList = pageData?.content || [];

    return (
        <div className="p-4 md:p-8 font-sans pb-24 md:pb-8">
            {/* Header */}
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
                        onClick={() => fetchCustomers(pageData.number, pageData.size, debouncedSearchTerm, true)}
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

            {/* Search Bar */}
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

            {/* Customers Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-5 font-bold tracking-wider">Khách hàng</th>
                                <th className="px-6 py-5 font-bold tracking-wider hidden sm:table-cell text-center">Liên hệ</th>
                                <th className="px-6 py-5 font-bold tracking-wider hidden md:table-cell">Địa chỉ</th>
                                <th className="px-6 py-5 font-bold tracking-wider">Ghi chú</th>
                                <th className="px-6 py-5 font-bold tracking-wider text-center">Tác vụ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="relative">
                                                <div className="w-12 h-12 border-4 border-emerald-500/20 rounded-full"></div>
                                                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                                            </div>
                                            <span className="font-medium">Đang đồng bộ dữ liệu...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : customersList.length > 0 ? (
                                customersList.map((customer, index) => (
                                    <tr
                                        key={customer.id}
                                        className="hover:bg-slate-800/40 transition-colors group"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <td className="px-6 py-5">
                                            <div className="font-extrabold text-slate-100 text-base mb-1.5 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{customer.name}</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono border border-emerald-500/20 font-bold tracking-wide">{customer.customerCode}</span>
                                                <span className="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-mono border border-slate-700">#{customer.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 hidden sm:table-cell">
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center gap-2 mb-1 text-emerald-400 font-bold font-mono">
                                                    <Phone className="w-3.5 h-3.5" /> {customer.phone}
                                                </div>
                                                {customer.email && (
                                                    <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                                                        <Mail className="w-3.5 h-3.5 text-slate-500" /> {customer.email}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-slate-400 hidden md:table-cell max-w-[200px] truncate">
                                            <div className="flex items-start gap-2.5">
                                                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                                                <span className="truncate leading-relaxed" title={customer.address}>{customer.address || <span className="text-slate-600 italic">Trống</span>}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-slate-400 max-w-[150px] truncate">
                                            <div className="flex items-start gap-2 text-xs">
                                                <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                                                <span className="truncate italic">{customer.notes || '...'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center gap-2.5">
                                                <button
                                                    onClick={() => {
                                                        setSelectedCustomer(customer);
                                                        setIsDetailsOpen(true);
                                                    }}
                                                    className="p-2 bg-slate-800 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 rounded-xl transition-all border border-slate-700 hover:border-emerald-500/30 active:scale-95"
                                                    title="Chi tiết"
                                                >
                                                    <History className="w-4.5 h-4.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenEdit(customer)}
                                                    className="p-2 bg-slate-800 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-xl transition-all border border-slate-700 hover:border-blue-500/30 active:scale-95"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Pencil className="w-4.5 h-4.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(customer)}
                                                    className="p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all border border-slate-700 hover:border-red-500/30 active:scale-95"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-4.5 h-4.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-24 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-4 opacity-40">
                                            <Search className="w-16 h-16" />
                                            <span className="text-lg font-medium">Trống - Hãy thử tìm kiếm khác</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-5 bg-slate-800/30 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-sm text-slate-400 font-medium">
                        Tổng cộng <span className="text-white bg-slate-800 px-3 py-1 rounded-full border border-slate-700 mx-1">{pageData?.totalElements || 0}</span> đối tác
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => handlePageChange((pageData?.number || 0) - 1)}
                            disabled={(pageData?.number || 0) === 0 || isLoading}
                            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all disabled:opacity-20 border border-slate-700 active:scale-90"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-1.5 mx-2">
                            {[...Array(pageData?.totalPages || 0)].map((_, i) => {
                                if (
                                    i === 0 ||
                                    i === (pageData?.totalPages || 1) - 1 ||
                                    (i >= (pageData?.number || 0) - 1 && i <= (pageData?.number || 0) + 1)
                                ) {
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handlePageChange(i)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all border ${(pageData?.number || 0) === i
                                                ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/40 scale-110'
                                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    );
                                } else if (
                                    i === (pageData?.number || 0) - 2 ||
                                    i === (pageData?.number || 0) + 2
                                ) {
                                    return <span key={i} className="text-slate-700 px-1">•••</span>;
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange((pageData?.number || 0) + 1)}
                            disabled={(pageData?.number || 0) === (pageData?.totalPages || 1) - 1 || isLoading}
                            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all disabled:opacity-20 border border-slate-700 active:scale-90"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MODAL CHI TIẾT --- */}
            {isDetailsOpen && selectedCustomer && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setIsDetailsOpen(false)}></div>
                    <div className="relative bg-slate-900 border border-slate-700 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Hồ sơ đối tác</h3>
                                    <p className="text-emerald-500 font-mono mt-1">CLIENT_ID: {selectedCustomer.id}</p>
                                </div>
                                <button onClick={() => setIsDetailsOpen(false)} className="text-slate-500 hover:text-white bg-slate-800 p-2.5 rounded-2xl transition-all active:rotate-90">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-950/50 border border-slate-800 rounded-3xl p-6 space-y-4">
                                    <div className="flex flex-col">
                                        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Tên khách hàng</span>
                                        <span className="text-white text-xl font-black uppercase">{selectedCustomer.name}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Điện thoại</span>
                                            <span className="text-emerald-400 text-lg font-mono font-bold italic">{selectedCustomer.phone}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Email</span>
                                            <span className="text-slate-200 font-medium truncate">{selectedCustomer.email || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col pt-2 border-t border-slate-800/50">
                                        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Vị trí kết nối</span>
                                        <span className="text-slate-300 leading-relaxed font-medium">{selectedCustomer.address || 'Chưa định vị'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Ghi chú đặc biệt</span>
                                        <div className="text-slate-400 text-sm bg-slate-900 border border-slate-800/50 p-4 rounded-2xl italic leading-relaxed">
                                            {selectedCustomer.notes || 'Hệ thống chưa ghi nhận thông tin bổ sung.'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button
                                    onClick={() => setIsDetailsOpen(false)}
                                    className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all font-black uppercase tracking-widest text-xs border border-slate-700 shadow-xl"
                                >
                                    Đóng cửa sổ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL THÊM / SỬA (SHARED COMPONENT) --- */}
            {isModalOpen && (
                <CustomerModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                    initialData={selectedCustomer}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
}
