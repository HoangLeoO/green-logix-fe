import api from '../axios';

export const categoryApi = {
    // Lấy tất cả danh mục
    getAll: async () => {
        const response = await api.get('/categories');
        return response.data;
    },

    // Thêm mới danh mục
    create: async (categoryData) => {
        const response = await api.post('/categories', categoryData);
        return response.data;
    },

    // Cập nhật danh mục
    update: async (id, categoryData) => {
        const response = await api.put(`/categories/${id}`, categoryData);
        return response.data;
    }
};
