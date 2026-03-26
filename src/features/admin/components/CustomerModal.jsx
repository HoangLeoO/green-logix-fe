import React from 'react';
import {
    X,
    UserPlus,
    Pencil,
    Save,
    Loader2,
    AlertCircle,
    PlusCircle,
    Trash2,
    Store,
    Wallet
} from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Validation Schema với Zod
const customerSchema = z.object({
    name: z.string().min(2, "Tên khách hàng phải có ít nhất 2 ký tự"),
    phone: z.string().regex(/^(0|\+84)(\d{9,10})$/, "Số điện thoại không hợp lệ (9-10 số)"),
    email: z.string().email("Email không đúng định dạng").optional().or(z.literal('')),
    address: z.string().optional(),
    notes: z.string().optional(),
    totalDebt: z.preprocess((val) => (val === '' ? 0 : Number(val)), z.number().min(0, "Công nợ không được âm")).optional().default(0),

    branches: z.array(z.object({
        branchName: z.string().min(2, "Tên chi nhánh không được để trống"),
        phone: z.string().optional().or(z.literal('')),
        address: z.string().optional().or(z.literal(''))
    })).optional().default([])
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
        control,
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
            notes: '',
            totalDebt: initialData?.totalDebt || 0,
            branches: initialData?.branches || []

        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "branches"
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

                    {/* Total Debt Input */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Công nợ ban đầu (VND)</label>
                        <div className="relative">
                            <input
                                type="number"
                                {...register('totalDebt')}
                                className={`w-full bg-slate-950 border ${errors.totalDebt ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-2.5 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500 transition-colors pl-10`}
                                placeholder="0"
                            />
                            <Wallet className="w-5 h-5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                        {errors.totalDebt && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.totalDebt.message}
                            </p>
                        )}
                        <p className="text-slate-500 text-[10px] mt-1 italic">* Số tiền khách nợ cũ tính đến thời điểm hiện tại.</p>
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

                    {/* --- QUẢN LÝ ĐA CHI NHÁNH --- */}
                    <div className="pt-4 border-t border-slate-800/50">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                                <Store className="w-4 h-4 text-emerald-400" />
                                Chi nhánh trực thuộc
                            </h4>
                            <button
                                type="button"
                                onClick={() => append({ branchName: '', phone: '', address: '' })}
                                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                            >
                                <PlusCircle className="w-3.5 h-3.5" />
                                Thêm CN
                            </button>
                        </div>

                        {fields.length === 0 ? (
                            <div className="text-center py-6 px-4 bg-slate-900/50 border border-slate-800/50 border-dashed rounded-2xl text-slate-500 text-sm italic">
                                Khách hàng chưa khai báo chi nhánh phụ.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="p-4 bg-slate-800/30 border border-slate-800 rounded-2xl space-y-3 relative group animate-in fade-in slide-in-from-top-2">
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="absolute top-2 right-2 p-1.5 text-slate-500 hover:text-red-400 bg-slate-900 border border-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>

                                        <div>
                                            <input
                                                {...register(`branches.${index}.branchName`)}
                                                className={`w-full bg-slate-950 border ${errors?.branches?.[index]?.branchName ? 'border-red-500' : 'border-slate-800'} rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500`}
                                                placeholder="Tên chi nhánh (VD: CN Quận 1) *"
                                            />
                                            {errors?.branches?.[index]?.branchName && (
                                                <p className="text-red-500 text-[10px] mt-1">{errors.branches[index].branchName.message}</p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                {...register(`branches.${index}.phone`)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                                                placeholder="SĐT liên hệ"
                                            />
                                            <input
                                                {...register(`branches.${index}.address`)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                                                placeholder="Địa chỉ cụ thể"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
