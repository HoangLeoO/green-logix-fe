import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm interceptor để đính kèm Token vào Header của mọi request
api.interceptors.request.use(
    (config) => {
        const authData = localStorage.getItem('auth-storage');
        if (authData) {
            const { state } = JSON.parse(authData);
            if (state?.token) {
                config.headers.Authorization = `Bearer ${state.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm interceptor để xử lý lỗi (ví dụ: Token hết hạn)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Nếu lỗi 401 (Unauthorized) và không phải đang ở trang login
        // thì mới chuyển hướng về login (để tránh reload khi login sai)
        if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
            localStorage.removeItem('auth-storage');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
