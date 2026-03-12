import React from 'react';
import {
    X,
    UserPlus,
    Pencil,
    Save,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Validation Schema với Zod
const customerSchema = z.object({
    name: z.string().min(2, "Tên khách hàng phải có ít nhất 2 ký tự"),
    phone: z.string().regex(/^(0|\+84)(\d{9,10})$/, "Số điện thoại không hợp lệ (9-10 số)"),
    email: z.string().email("Email không đúng định dạng").optional().or(z.literal('')),
    address: z.string().optional(),
    notes: z.string().optional(),
});

export default function CustomerModal({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
    isSubmitting = false
}) {
    const isEdit = !!initialData;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(customerSchema),
        defaultValues: initialData || {
            name: '',
            phone: '',
            address: '',
            email: '',
            notes: ''
        }
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {isEdit ? <Pencil className="w-5 h-5 text-blue-400" /> : <UserPlus className="w-5 h-5 text-emerald-400" />}
                        {isEdit ? 'Chỉnh sửa Khách hàng' : 'Thêm Khách hàng mới'}
                    </h3>
                    <button type="button" onClick={onClose} className="text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Tên khách hàng / Quán ăn *</label>
                        <input
                            {...register('name')}
                            className={`w-full bg-slate-950 border ${errors.name ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors`}
                            placeholder="VD: Bếp Cơm Mười Khó"
                            autoFocus
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-in slide-in-from-top-1">
                                <AlertCircle className="w-3 h-3" /> {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Phone Input */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Số điện thoại *</label>
                            <input
                                {...register('phone')}
                                className={`w-full bg-slate-950 border ${errors.phone ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors`}
                                placeholder="09..."
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-in slide-in-from-top-1">
                                    <AlertCircle className="w-3 h-3" /> {errors.phone.message}
                                </p>
                            )}
                        </div>
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                            <input
                                {...register('email')}
                                className={`w-full bg-slate-950 border ${errors.email ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors`}
                                placeholder="vidu@mail.com"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-in slide-in-from-top-1">
                                    <AlertCircle className="w-3 h-3" /> {errors.email.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Address Input */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Địa chỉ giao hàng</label>
                        <input
                            {...register('address')}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                            placeholder="Số nhà, Tên đường..."
                        />
                    </div>

                    {/* Notes Input */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Ghi chú</label>
                        <textarea
                            {...register('notes')}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 min-h-[100px] transition-colors resize-none"
                            placeholder="Thông tin thêm về khách hàng..."
                        ></textarea>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-slate-400 hover:text-white font-medium text-sm transition-all rounded-xl hover:bg-slate-800"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2.5 ${isEdit ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'} text-white rounded-xl transition-all shadow-lg font-bold text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isEdit ? 'Cập nhật thay đổi' : 'Lưu khách hàng'}
                    </button>
                </div>
            </form>
        </div>
    );
}
