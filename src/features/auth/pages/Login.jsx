import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Leaf, Mail, Lock, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { authApi } from '../../../api/services/auth';
import { useAuthStore } from '../../../store/useAuthStore';
import { toast } from 'sonner';

// Zod schema để validate form đăng nhập
const loginSchema = z.object({
    identifier: z.string().min(1, { message: 'Vui lòng nhập Tên đăng nhập hoặc Số điện thoại' }),
    password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
});

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(''); // Thêm state lưu lỗi từ API
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        setApiError(''); // Xóa lỗi cũ khi bắt đầu submit
        try {
            const response = await authApi.login(data);

            // response từ Spring Boot: { token, id, username, displayName, roles }
            const { token, ...user } = response;

            // Lưu vào Zustand và LocalStorage
            setAuth(user, token);

            toast.success('Đăng nhập thành công!');

            // Chuyển hướng theo role hoặc mặc định sang dashboard
            if (user.roles?.includes('ADMIN')) {
                navigate('/dashboard');
            } else {
                navigate('/dashboard'); // Hoặc sang /portal nếu là khách hàng
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);

            // Dịch lỗi sang tiếng Việt
            let message = 'Tên đăng nhập hoặc mật khẩu không chính xác';

            if (error.code === 'ERR_NETWORK') {
                message = 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại mạng.';
            } else if (error.response?.status === 403) {
                message = 'Tài khoản của bạn không có quyền truy cập.';
            }

            setApiError(message); // Hiển thị trên form
            toast.error(message); // Hiển thị toast
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center">
                    <div className="bg-emerald-500/10 p-4 rounded-full border border-emerald-500/20 backdrop-blur-sm shadow-xl shadow-emerald-500/10">
                        <Leaf className="w-10 h-10 text-emerald-400" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
                    Chào mừng trở lại
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    Đăng nhập vào hệ thống <span className="text-emerald-400 font-semibold">GreenLogix</span>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-slate-900/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-slate-800">

                    {/* Hiển thị lỗi API lên Form */}
                    {apiError && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="text-sm font-medium text-red-400">{apiError}</span>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

                        {/* Field: Identifier (Username / Phone) */}
                        <div>
                            <label htmlFor="identifier" className="block text-sm font-medium text-slate-300">
                                Tên đăng nhập / Số điện thoại
                            </label>
                            <div className="mt-2 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    id="identifier"
                                    type="text"
                                    placeholder="Nhập tên đăng nhập hoặc SĐT..."
                                    className={`block w-full pl-10 pr-3 py-3 border ${errors.identifier ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-700 focus:ring-emerald-500 focus:border-emerald-500'
                                        } rounded-xl bg-slate-950/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 sm:text-sm transition-all duration-200`}
                                    {...register('identifier')}
                                />
                            </div>
                            {errors.identifier && (
                                <p className="mt-2 text-sm text-red-400 animate-pulse">{errors.identifier.message}</p>
                            )}
                        </div>

                        {/* Field: Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                                Mật khẩu
                            </label>
                            <div className="mt-2 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className={`block w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-700 focus:ring-emerald-500 focus:border-emerald-500'
                                        } rounded-xl bg-slate-950/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 sm:text-sm transition-all duration-200`}
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-emerald-400 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-400 animate-pulse">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Options */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-slate-700 rounded bg-slate-900"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
                                    Ghi nhớ tôi
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                                    Quên mật khẩu?
                                </a>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-500/20 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                                        Đang xác thực...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                                        Đăng nhập hệ thống
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Additional text */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-slate-900 text-slate-500">
                                    Hệ thống quản lý nội bộ
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
