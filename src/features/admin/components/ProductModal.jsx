import React, { useEffect, useState } from 'react';
import {
    X,
    Package,
    Pencil,
    Save,
    Loader2,
    AlertCircle,
    Tag,
    DollarSign,
    Layers,
    Boxes
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { categoryApi } from '../../../api/services/category';

// Validation Schema với Zod
const productSchema = z.object({
    name: z.string().min(2, "Tên sản phẩm phải có ít nhất 2 ký tự"),
    unit: z.string().min(1, "Đơn vị tính không được để trống"),
    defaultPrice: z.coerce.number().min(0, "Giá mặc định không được âm"),
    stockQuantity: z.coerce.number().min(0, "Số lượng tồn kho không được âm"),
    minStockLevel: z.coerce.number().min(0, "Mức tồn kho tối thiểu không được âm"),
    categoryId: z.coerce.number().optional().nullable(),
    isActive: z.boolean().default(true),
});

export default function ProductModal({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
    isSubmitting = false
}) {
    const isEdit = !!initialData;
    const [categories, setCategories] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: initialData ? {
            ...initialData,
            categoryId: initialData.category?.id || null,
        } : {
            name: '',
            unit: 'Kg',
            defaultPrice: 0,
            stockQuantity: 0,
            minStockLevel: 0,
            categoryId: null,
            isActive: true,
        }
    });

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const fetchCategories = async () => {
        try {
            const data = await categoryApi.getAll();
            setCategories(data);
        } catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {isEdit ? <Pencil className="w-5 h-5 text-blue-400" /> : <Package className="w-5 h-5 text-emerald-400" />}
                        {isEdit ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm mới'}
                    </h3>
                    <button type="button" onClick={onClose} className="text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-2">
                            <Tag className="w-4 h-4" /> Tên sản phẩm *
                        </label>
                        <input
                            {...register('name')}
                            className={`w-full bg-slate-950 border ${errors.name ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors`}
                            placeholder="VD: Cà chua VietGAP"
                            autoFocus
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 animate-in slide-in-from-top-1">
                                <AlertCircle className="w-3 h-3" /> {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Category Select */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-2">
                                <Layers className="w-4 h-4" /> Danh mục
                            </label>
                            <select
                                {...register('categoryId')}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Unit Input */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-2">
                                <Boxes className="w-4 h-4" /> Đơn vị tính *
                            </label>
                            <input
                                {...register('unit')}
                                className={`w-full bg-slate-950 border ${errors.unit ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors`}
                                placeholder="Kg, Bó, Thùng..."
                            />
                            {errors.unit && (
                                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {errors.unit.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Default Price Input */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" /> Giá mặc định (VNĐ) *
                            </label>
                            <input
                                type="number"
                                {...register('defaultPrice')}
                                className={`w-full bg-slate-950 border ${errors.defaultPrice ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors font-mono`}
                                placeholder="0"
                            />
                            {errors.defaultPrice && (
                                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {errors.defaultPrice.message}
                                </p>
                            )}
                        </div>

                        {/* Status Toggle */}
                        <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800 self-end h-[52px]">
                            <label className="text-sm font-medium text-slate-400">Trạng thái kinh doanh</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register('isActive')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Stock Quantity */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Số lượng tồn kho</label>
                            <input
                                type="number"
                                {...register('stockQuantity')}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                                placeholder="0"
                            />
                        </div>

                        {/* Min Stock Level */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Mức tồn tối thiểu (cảnh báo)</label>
                            <input
                                type="number"
                                {...register('minStockLevel')}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 text-slate-400 hover:text-white font-medium text-sm transition-all rounded-xl hover:bg-slate-800"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-8 py-2.5 ${isEdit ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'} text-white rounded-xl transition-all shadow-lg font-bold text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95`}
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isEdit ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
                    </button>
                </div>
            </form>
        </div>
    );
}
