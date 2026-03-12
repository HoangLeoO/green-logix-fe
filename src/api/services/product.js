import api from '../axios';

export const productApi = {
    // Lấy danh sách sản phẩm có phân trang và tìm kiếm
    getAll: async (params = {}) => {
        const response = await api.get('/products', { params });
        return response.data;
    },

    // Lấy chi tiết sản phẩm theo ID
    getById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    // Thêm mới sản phẩm
    create: async (productData) => {
        const response = await api.post('/products', productData);
        return response.data;
    },

    // Cập nhật thông tin sản phẩm
    update: async (id, productData) => {
        const response = await api.put(`/products/${id}`, productData);
        return response.data;
    },

    // Xóa sản phẩm
    delete: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    }
};
