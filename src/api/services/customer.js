import api from '../axios';

export const customerApi = {
    // Lấy danh sách khách hàng có phân trang và tìm kiếm
    getAll: async (params = {}) => {
        const response = await api.get('/customers', { params });
        return response.data;
    },

    // Lấy thông tin chi tiết một khách hàng theo ID
    getById: async (id) => {
        const response = await api.get(`/customers/${id}`);
        return response.data;
    },

    // Tạo mới một khách hàng
    create: async (customerData) => {
        const response = await api.post('/customers', customerData);
        return response.data;
    },

    // Cập nhật thông tin khách hàng
    update: async (id, customerData) => {
        const response = await api.put(`/customers/${id}`, customerData);
        return response.data;
    },

    // Xóa khách hàng (Yêu cầu quyền ADMIN)
    delete: async (id) => {
        const response = await api.delete(`/customers/${id}`);
        return response.data;
    }
};
