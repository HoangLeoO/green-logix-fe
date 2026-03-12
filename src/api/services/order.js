import api from '../axios';

export const orderApi = {
    // Lấy danh sách đơn hàng có phân trang và lọc
    getAll: async (params = {}) => {
        const response = await api.get('/orders', { params });
        return response.data;
    },

    // Lấy chi tiết đơn hàng theo ID
    getById: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    // Tạo đơn hàng mới
    create: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    // Cập nhật trạng thái đơn hàng
    updateStatus: async (id, status) => {
        const response = await api.patch(`/orders/${id}/status`, null, { params: { status } });
        return response.data;
    },

    // Lấy lịch sử xử lý đơn hàng
    getLogs: async (id) => {
        const response = await api.get(`/orders/${id}/logs`);
        return response.data;
    },
};
