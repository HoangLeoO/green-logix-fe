import React, { useState, useEffect, useCallback } from 'react';
import {
    Search,
    Package,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Plus,
    AlertTriangle,
    CheckCircle2,
    Inbox,
    Filter,
    Layers,
    History
} from 'lucide-react';
import { toast } from 'sonner';
import { productApi } from '../../../api/services/product';
import { categoryApi } from '../../../api/services/category';
import { useConfirmStore } from '../../../store/useConfirmStore';
import { useDebounce } from '../../../hooks/useDebounce';
import ProductModal from '../components/ProductModal';
import StockHistoryModal from '../components/StockHistoryModal';

export default function Products() {
    const [pageData, setPageData] = useState({
        content: [],
        totalPages: 0,
        totalElements: 0,
        number: 0,
        size: 10
    });
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const showConfirm = useConfirmStore((state) => state.showConfirm);

    // Modal states
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [historyProduct, setHistoryProduct] = useState(null);

    // Fetch danh mục để lọc
    const fetchCategories = async () => {
        try {
            const data = await categoryApi.getAll();
            setCategories(data);
        } catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
        }
    };

    // Fetch dữ liệu sản phẩm
    const fetchProducts = useCallback(async (page = 0, size = 10, search = '', categoryId = '', showLoading = true) => {
        if (showLoading) setIsLoading(true);
        try {
            const params = {
                page,
                size,
                search: search ? search.trim() : ''
            };
            if (categoryId) params.categoryId = categoryId;

            const data = await productApi.getAll(params);

            if (data && data.content) {
                setPageData(data);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách sản phẩm:", error);
            if (showLoading) toast.error("Lỗi kết nối Server. Vui lòng thử lại!");
        } finally {
            if (showLoading) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts(0, pageData.size, debouncedSearchTerm, selectedCategoryId);
    }, [debouncedSearchTerm, selectedCategoryId, fetchProducts, pageData.size]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < (pageData?.totalPages || 0)) {
            fetchProducts(newPage, pageData.size, debouncedSearchTerm, selectedCategoryId);
        }
    };

    const handleOpenAdd = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleOpenHistory = (product) => {
        setHistoryProduct(product);
        setIsHistoryOpen(true);
    };

    const handleModalSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
                category: data.categoryId ? { id: parseInt(data.categoryId) } : null
            };
            delete payload.categoryId;

            if (!selectedProduct) {
                await productApi.create(payload);
                toast.success("Thêm sản phẩm mới thành công!");
            } else {
                await productApi.update(selectedProduct.id, payload);
                toast.success("Cập nhật sản phẩm thành công!");
            }
            setIsModalOpen(false);
            fetchProducts(pageData.number, pageData.size, debouncedSearchTerm, selectedCategoryId, false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (product) => {
        showConfirm({
            title: 'Xóa sản phẩm',
            message: `Bạn có chắc muốn xóa sản phẩm "${product.name}"?`,
            confirmText: 'Xóa vĩnh viễn',
            type: 'danger',
            onConfirm: async () => {
                try {
                    await productApi.delete(product.id);
                    toast.success("Đã xóa sản phẩm");
                    fetchProducts(pageData.number, pageData.size, debouncedSearchTerm, selectedCategoryId, false);
                } catch (error) {
                    toast.error("Không thể xóa sản phẩm.");
                }
            }
        });
    };

    const handleToggleStatus = async (product) => {
        try {
            const payload = {
                ...product,
                isActive: !product.isActive,
                category: product.category?.id ? { id: product.category.id } : null
            };

            await productApi.update(product.id, payload);
            toast.success(`Đã ${!product.isActive ? 'mở' : 'tạm dừng'} kinh doanh: ${product.name}`);
            fetchProducts(pageData.number, pageData.size, debouncedSearchTerm, selectedCategoryId, false);
        } catch (error) {
            toast.error("Không thể cập nhật trạng thái.");
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const productsList = pageData?.content || [];

    return (
        <div className="p-4 md:p-8 font-sans pb-24 md:pb-8">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="animate-in fade-in slide-in-from-left duration-500">
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 italic uppercase tracking-tighter">
                        <Package className="w-10 h-10 text-emerald-500" />
                        Kho Sản Phẩm
                    </h1>
                    <p className="text-slate-400 mt-1 font-medium">Lọc theo tên hoặc danh mục hàng hóa</p>
                </div>

                <div className="flex gap-3 animate-in fade-in slide-in-from-right duration-500">
                    <button
                        onClick={() => fetchProducts(pageData.number, pageData.size, debouncedSearchTerm, selectedCategoryId)}
                        className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition-all border border-slate-700 active:scale-95 shadow-lg"
                        title="Làm mới"
                    >
                        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={handleOpenAdd}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black uppercase text-sm tracking-widest transition-all shadow-xl shadow-emerald-600/20 active:scale-95 border-b-4 border-emerald-800 hover:border-emerald-700"
                    >
                        <Plus className="w-5 h-5" />
                        Thêm mặt hàng
                    </button>
                </div>
            </div>

            {/* Filter & Search Bar */}
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

            {/* Products Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-950/50 border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-5 font-black uppercase text-xs tracking-widest text-slate-500">Mặt hàng</th>
                                <th className="px-6 py-5 font-black uppercase text-xs tracking-widest text-slate-500 text-center">Danh mục</th>
                                <th className="px-6 py-5 font-black uppercase text-xs tracking-widest text-slate-500 text-right">Đơn giá</th>
                                <th className="px-6 py-5 font-black uppercase text-xs tracking-widest text-slate-500 text-center">Tồn kho</th>
                                <th className="px-6 py-5 font-black uppercase text-xs tracking-widest text-slate-500 text-center">Trạng thái</th>
                                <th className="px-6 py-5 font-black uppercase text-xs tracking-widest text-slate-500 text-center">Tác vụ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="font-black uppercase text-xs tracking-[0.2em] text-emerald-500">Đang quét kho hàng...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : productsList.length > 0 ? (
                                productsList.map((product, index) => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-slate-800/40 transition-all group border-l-4 border-l-transparent hover:border-l-emerald-500"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <td className="px-6 py-5">
                                            <div className="font-black text-slate-100 text-lg uppercase group-hover:text-emerald-400 transition-colors leading-none mb-1.5">{product.name}</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono border border-emerald-500/20 font-bold tracking-wide">{product.sku}</span>
                                                <span className="text-[10px] bg-slate-950 text-slate-500 px-2 py-0.5 rounded-full font-bold border border-slate-800 uppercase">/{product.unit}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="bg-slate-950 text-emerald-500 px-3 py-1 rounded-lg border border-emerald-500/20 text-xs font-black uppercase">
                                                {product.category?.name || 'Chưa phân loại'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right font-black text-white text-base font-mono italic">
                                            {formatPrice(product.defaultPrice)}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className={`text-lg font-black font-mono ${product.stockQuantity <= product.minStockLevel ? 'text-red-500 animate-pulse' : 'text-slate-200'}`}>
                                                    {product.stockQuantity}
                                                </span>
                                                {product.stockQuantity <= product.minStockLevel && (
                                                    <span className="text-[9px] text-red-400 font-black uppercase flex items-center gap-1 mt-1">
                                                        <AlertTriangle className="w-2.5 h-2.5" /> Sắp hết hàng
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <button
                                                    onClick={() => handleToggleStatus(product)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner ${product.isActive ? 'bg-emerald-600 shadow-emerald-900/20' : 'bg-slate-700 shadow-slate-900/20'
                                                        }`}
                                                    title={product.isActive ? "Nhấn để dừng" : "Nhấn để bán"}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-md ${product.isActive ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                                <span className={`text-[9px] font-black uppercase tracking-tighter ${product.isActive ? 'text-emerald-500' : 'text-slate-500'}`}>
                                                    {product.isActive ? 'Đang bán' : 'Tạm dừng'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => handleOpenHistory(product)}
                                                    className="p-3 bg-slate-800 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-500 rounded-2xl transition-all shadow-lg active:scale-90 border-b-2 border-slate-700"
                                                    title="Lịch sử kho"
                                                >
                                                    <History className="w-4.5 h-4.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenEdit(product)}
                                                    className="p-3 bg-slate-800 hover:bg-blue-500/20 text-slate-400 hover:text-blue-500 rounded-2xl transition-all shadow-lg active:scale-90 border-b-2 border-slate-700"
                                                    title="Sửa"
                                                >
                                                    <Pencil className="w-4.5 h-4.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product)}
                                                    className="p-3 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-2xl transition-all shadow-lg active:scale-90 border-b-2 border-slate-700"
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
                                    <td colSpan="6" className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <Inbox className="w-20 h-20" />
                                            <span className="text-xl font-black uppercase tracking-widest italic">Kho hàng trống</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-6 bg-slate-950/30 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3">
                            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-0.5">Tổng số mặt hàng</span>
                            <span className="text-2xl font-black text-white italic">{pageData?.totalElements || 0}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange((pageData?.number || 0) - 1)}
                            disabled={(pageData?.number || 0) === 0 || isLoading}
                            className="p-3 bg-slate-800 hover:bg-slate-700 text-emerald-500 disabled:opacity-20 rounded-2xl transition-all border border-slate-700 active:scale-90"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-2 mx-2">
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
                                            className={`w-11 h-11 flex items-center justify-center rounded-2xl text-sm font-black transition-all border ${(pageData?.number || 0) === i
                                                ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-500/30 scale-110 -rotate-3'
                                                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white hover:bg-slate-800'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    );
                                } else if (
                                    i === (pageData?.number || 0) - 2 ||
                                    i === (pageData?.number || 0) + 2
                                ) {
                                    return <span key={i} className="text-slate-800 font-black">...</span>;
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange((pageData?.number || 0) + 1)}
                            disabled={(pageData?.number || 0) === (pageData?.totalPages || 1) - 1 || isLoading}
                            className="p-3 bg-slate-800 hover:bg-slate-700 text-emerald-500 disabled:opacity-20 rounded-2xl transition-all border border-slate-700 active:scale-90"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MODALS --- */}
            {isModalOpen && (
                <ProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                    initialData={selectedProduct}
                    isSubmitting={isSubmitting}
                />
            )}

            {isHistoryOpen && (
                <StockHistoryModal
                    isOpen={isHistoryOpen}
                    onClose={() => setIsHistoryOpen(false)}
                    product={historyProduct}
                />
            )}
        </div>
    );
}
