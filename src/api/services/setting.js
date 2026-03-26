import api from '../axios';

const settingService = {
    getAll: () => api.get('/settings'),
    getByGroup: (groupName) => api.get(`/settings/group/${groupName}`),
    update: (settings) => api.post('/settings/update', settings),
};

export default settingService;
