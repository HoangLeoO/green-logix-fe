import axios from '../axios';

const paymentService = {
    createPayment: async (paymentData) => {
        const response = await axios.post('/payments', paymentData);
        return response.data;
    },
    getPaymentsByCustomer: async (customerId) => {
        const response = await axios.get(`/payments/customer/${customerId}`);
        return response.data;
    },
    getAllPayments: async (params) => {
        const response = await axios.get('/payments', { params });
        return response.data;
    }
};

export default paymentService;
