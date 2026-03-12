import api from '../axios';

export const authApi = {
    login: async (credentials) => {
        // Backend yêu cầu { "username": "...", "password": "..." }
        // Frontend Login.jsx đang gửi { "identifier": "...", "password": "..." }
        const response = await api.post('/auth/login', {
            username: credentials.identifier,
            password: credentials.password
        });
        return response.data;
    },

    signup: async (userData) => {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    }
};
