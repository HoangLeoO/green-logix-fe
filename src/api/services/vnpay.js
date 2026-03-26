import axios from "../axios";

const vnpayService = {
    createPayment: async (amount, orderInfo, customerId) => {
        // Axios baseURL already includes /api, so we call /vnpay/create-payment
        const response = await axios.post(`/vnpay/create-payment`, null, {
            params: { amount, orderInfo, customerId }
        });
        return response.data;
    }
};

export default vnpayService;
