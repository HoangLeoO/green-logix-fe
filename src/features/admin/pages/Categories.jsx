import React, { useState, useEffect } from 'react';
import {
    Layers, Plus, Pencil, Trash2, RefreshCw,
    Search, ChevronLeft, ChevronRight, X, Save, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { categoryApi } from '../../../api/services/category';
import { useConfirmStore } from '../../../store/useConfirmStore';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    const showConfirm = useConfirmStore((state) => state.showConfirm);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const data = await categoryApi.getAll();
            setCategories(data);
        } catch (error) {
            toast.error("Không thể tải danh sách danh mục");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModal = (category = null) => {
        if (category) {
            setSelectedCategory(category);
            setFormData({ name: category.name, description: category.description || '' });
        } else {
            setSelectedCategory(null);
            setFormData({ name: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error("Vui lòng nhập tên danh mục");
            return;
        }

        setIsSubmitting(true);
        try {
            if (selectedCategory) {
                await categoryApi.update(selectedCategory.id, formData);
                toast.success("Cập nhật danh mục thành công");
            } else {
                await categoryApi.create(formData);
                toast.success("Thêm danh mục mới thành công");
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 font-sans pb-24 md:pb-8">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="animate-in fade-in slide-in-from-left duration-500">
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 italic uppercase tracking-tighter">
                        <Layers className="w-10 h-10 text-emerald-500" />
                        Danh Mục Sản Phẩm
                    </h1>
                    <p className="text-slate-400 mt-1 font-medium">Quản lý các nhóm hàng hóa trong hệ thống</p>
                </div>

                <div className="flex gap-3 animate-in fade-in slide-in-from-right duration-500">
                    <button
                        onClick={fetchCategories}
                        className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition-all border border-slate-700 active:scale-95 shadow-lg"
                        title="Làm mới"
                    >
                        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black uppercase text-sm tracking-widest transition-all shadow-xl shadow-emerald-600/20 active:scale-95 border-b-4 border-emerald-800 hover:border-emerald-700"
                    >
                        <Plus className="w-5 h-5" />
                        Thêm danh mục
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6 animate-in fade-in slide-in-from-bottom duration-500">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-500" />
                </div>
                <input
                    type="text"
                    placeholder="Tìm kiếm danh mục..."
                    className="block w-full pl-12 pr-4 py-4 border border-slate-700 bg-slate-900 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Content Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-950/50 border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-5 font-black uppercase text-xs tracking-widest text-slate-500">Tên danh mục</th>
                                <th className="px-6 py-5 font-black uppercase text-xs tracking-widest text-slate-500">Mô tả</th>
                                <th className="px-6 py-5 font-black uppercase text-xs tracking-widest text-slate-500 text-center">Tác vụ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="font-black uppercase text-xs tracking-[0.2em] text-emerald-500">Đang đồng bộ...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCategories.length > 0 ? (
                                filteredCategories.map((cat, index) => (
                                    <tr
                                        key={cat.id}
                                        className="hover:bg-slate-800/40 transition-all group border-l-4 border-l-transparent hover:border-l-emerald-500"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <td className="px-6 py-5">
                                            <div className="font-black text-slate-100 text-lg uppercase group-hover:text-emerald-400 transition-colors leading-none">{cat.name}</div>
                                        </td>
                                        <td className="px-6 py-5 text-slate-400 font-medium italic">
                                            {cat.description || <span className="text-slate-700">Không có mô tả</span>}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => handleOpenModal(cat)}
                                                    className="p-3 bg-slate-800 hover:bg-blue-500/20 text-slate-400 hover:text-blue-500 rounded-2xl transition-all shadow-lg active:scale-90 border-b-2 border-slate-700"
                                                >
                                                    <Pencil className="w-4.5 h-4.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-24 text-center">
                                        <span className="text-slate-600 font-bold uppercase tracking-widest italic">Không tìm thấy danh mục</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
                    <div className="relative bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500"></div>

                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                                        {selectedCategory ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
                                    </h2>
                                    <p className="text-slate-400 text-sm font-medium">Nhập thông tin phân loại hàng hóa</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-slate-800 text-slate-500 hover:text-white rounded-xl transition-all"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em] ml-1">Tên danh mục *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Layers className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white font-bold focus:ring-2 focus:ring-emerald-500/50 focus:outline-none transition-all"
                                            placeholder="VD: Rau ăn lá, Củ quả..."
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Mô tả chi tiết</label>
                                    <textarea
                                        rows="3"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-4 text-white font-medium focus:ring-2 focus:ring-emerald-500/50 focus:outline-none transition-all resize-none"
                                        placeholder="Ghi chú thêm về danh mục này..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black uppercase text-sm tracking-widest rounded-2xl transition-all active:scale-95 border-b-4 border-slate-950"
                                    >
                                        Hủy bỏ
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-sm tracking-widest rounded-2xl transition-all active:scale-95 border-b-4 border-emerald-800 shadow-xl shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Save className="w-5 h-5" />
                                        )}
                                        {selectedCategory ? 'Lưu thay đổi' : 'Tạo danh mục'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
