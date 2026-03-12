import api from '../axios';

export const stockApi = {
    // Lấy lịch sử biến động kho của một sản phẩm
    getByProduct: async (productId, params = {}) => {
        const response = await api.get(`/stock-movements/product/${productId}`, { params });
        return response.data;
    }
};
