import axios from '../axios';

const dashboardService = {
    getStats: async () => {
        try {
            const response = await axios.get('/admin/dashboard/stats');
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy thống kê dashboard:', error);
            throw error;
        }
    }
};

export default dashboardService;
