import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Leaf, Store, Send, Loader2, CheckCircle, PlusCircle, Trash2, ShieldCheck, MapPin, Phone } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../../api/axios';

const registerSchema = z.object({
    name: z.string().min(2, 'Tên nhà hàng/quán ăn phải từ 2 ký tự').max(150),
    phone: z.string().min(10, 'Số điện thoại không hợp lệ').max(20),
    address: z.string().min(5, 'Vui lòng nhập chi tiết địa chỉ'),
    email: z.string().email('Email không hợp lệ').or(z.literal('')),
    notes: z.string().optional(),
    branches: z.array(z.object({
        branchName: z.string().min(2, 'Tên chi nhánh không được để trống'),
        phone: z.string().optional(),
        address: z.string().optional()
    })).optional()
});

export default function RegisterStore() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            phone: '',
            address: '',
            email: '',
            notes: '',
            branches: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "branches"
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await api.post('/public/register-customer', data);
            setIsSubmitted(true);
            toast.success('Đã gửi yêu cầu đăng ký thành công!');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.');
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
                {/* Background effects */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center relative z-10 shadow-2xl animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-3">Đăng Ký Thành Công!</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed text-sm">
                        Thông tin của bạn đã được gửi đến hệ thống GreenLogix. Đội ngũ của chúng tôi sẽ liên hệ trong thời gian sớm nhất để xác nhận và mở tài khoản mua sỉ cho bạn.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-xl transition-colors border border-slate-700"
                    >
                        Tạo yêu cầu mới
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex justify-center items-center p-4 md:p-8 relative overflow-hidden font-sans">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl grid md:grid-cols-5 overflow-hidden shadow-2xl relative z-10 animate-in slide-in-from-bottom-8 duration-700">
                {/* Cột trái: Brand Info */}
                <div className="md:col-span-2 bg-gradient-to-br from-emerald-900/50 to-slate-900 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
                    <div>
                        <div className="flex items-center gap-2 mb-8">
                            <Leaf className="w-8 h-8 text-emerald-400" />
                            <span className="text-2xl font-black text-white tracking-tight">GreenLogix</span>
                        </div>
                        <h2 className="text-xl md:text-3xl font-black text-white mb-4 leading-snug">
                            Cung cấp thực phẩm xanh<br />cho mọi nhà hàng
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">
                            Trở thành đối tác mua sỉ của chúng tôi để nhận các ưu đãi giá cạnh tranh, rau củ quả tươi sạch hằng ngày và hệ thống báo cáo công nợ minh bạch.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-800/50 rounded-lg mt-0.5">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-200">Hoàn toàn bảo mật</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">Chúng tôi cam kết không tiết lộ thông tin của bạn cho bên thứ 3.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-800/50 rounded-lg mt-0.5">
                                    <Store className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-200">Quản lý đa chi nhánh</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">Một tài khoản, quản lý đặt hàng cho chuỗi các cửa hàng dễ dàng.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cột phải: Form */}
                <div className="md:col-span-3 p-8 lg:p-10 bg-slate-900">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-2">Đăng ký đối tác cấp sỉ</h3>
                            <p className="text-slate-500 text-sm">Điền thông tin doanh nghiệp của bạn để bắt đầu.</p>
                        </div>

                        <div className="space-y-5 flex-1 relative z-10 min-w-0">
                            {/* Tên Quán */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Tên Khách Hàng / Thương Hiệu *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Store className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <input
                                        {...register('name')}
                                        className={`w-full pl-10 pr-4 py-3 bg-slate-950 border ${errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-emerald-500'} rounded-xl text-slate-200 focus:outline-none transition-colors text-sm`}
                                        placeholder="Ví dụ: Cơm Tấm A. Ba"
                                    />
                                </div>
                                {errors.name && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.name.message}</p>}
                            </div>

                            {/* Liên hệ: SĐT & Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">SĐT Liên Hệ *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <input
                                            {...register('phone')}
                                            className={`w-full pl-10 pr-4 py-3 bg-slate-950 border ${errors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-emerald-500'} rounded-xl text-slate-200 focus:outline-none transition-colors text-sm`}
                                            placeholder="SĐT chính..."
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.phone.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Email (Không bắt buộc)</label>
                                    <input
                                        {...register('email')}
                                        className={`w-full px-4 py-3 bg-slate-950 border ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-emerald-500'} rounded-xl text-slate-200 focus:outline-none transition-colors text-sm`}
                                        placeholder="Để nhận báo giá ưu đãi"
                                    />
                                    {errors.email && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
                                </div>
                            </div>

                            {/* Trụ sở chính */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Địa chỉ giao hàng chính *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                                        <MapPin className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <textarea
                                        {...register('address')}
                                        rows={2}
                                        className={`w-full pl-10 pr-4 py-3 bg-slate-950 border ${errors.address ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-emerald-500'} rounded-xl text-slate-200 focus:outline-none transition-colors resize-none text-sm`}
                                        placeholder="Số nhà, đường, phường, quận..."
                                    />
                                </div>
                                {errors.address && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.address.message}</p>}
                            </div>

                            {/* Chi nhánh (Tuỳ chọn) */}
                            <div className="pt-4 border-t border-slate-800/50">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Bạn có thêm chi nhánh? (Tuỳ chọn)</label>
                                    <button
                                        type="button"
                                        onClick={() => append({ branchName: '', phone: '', address: '' })}
                                        className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1.5 rounded-lg border border-emerald-500/20 transition-colors"
                                    >
                                        <PlusCircle className="w-3.5 h-3.5" /> Thêm CN
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl relative group">
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="absolute top-3 right-3 text-slate-500 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="pr-6 space-y-3">
                                                <div>
                                                    <input
                                                        {...register(`branches.${index}.branchName`)}
                                                        className={`w-full px-3 py-2 bg-slate-900 border ${errors?.branches?.[index]?.branchName ? 'border-red-500/50' : 'border-slate-700'} rounded-lg text-sm text-slate-200 focus:border-emerald-500 focus:outline-none`}
                                                        placeholder="Tên chi nhánh (VD: CN Quận 1) *"
                                                    />
                                                    {errors?.branches?.[index]?.branchName && (
                                                        <p className="text-red-400 text-[10px] mt-1">{errors.branches[index].branchName.message}</p>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        {...register(`branches.${index}.phone`)}
                                                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                                                        placeholder="SĐT nhánh (nếu có)"
                                                    />
                                                    <input
                                                        {...register(`branches.${index}.address`)}
                                                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                                                        placeholder="Địa chỉ nhánh (nếu có)"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Nhu cầu mua (Ghi chú) */}
                            <div className="pt-2">
                                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Các mặt hàng quan tâm (Ghi chú)</label>
                                <textarea
                                    {...register('notes')}
                                    rows={2}
                                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-slate-200 focus:outline-none transition-colors resize-none text-sm"
                                    placeholder="Bạn thường nhập mặt hàng nào? Số lượng bao nhiêu?..."
                                />
                            </div>
                        </div>

                        {/* Nút gửi */}
                        <div className="mt-8 pt-6 border-t border-slate-800">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Đang xử lý...</>
                                ) : (
                                    <><Send className="w-5 h-5" /> Gửi Yêu Cầu Đăng Ký</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
