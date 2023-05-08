import axiosConfig from './config/axiosConfig';

const admin = {
    getBannedUsers() {
        return axiosConfig
            .get('/api/admin/get-banned-users')
            .then(({data}) => data)
            .catch(({response}) => Promise.reject(response.data));
    },
    unbanUser(data) {
        return axiosConfig
            .post('/api/admin/unban-user', {data})
            .then(({data}) => data)
            .catch(({response}) => Promise.reject(response.data));
    },
    banUser(data) {
        return axiosConfig
            .post('/api/admin/ban-user', {data})
            .then(({data}) => data)
            .catch(({response}) => Promise.reject(response.data));
    },
    getFlaggedUsers() {
        return axiosConfig
            .get('/api/admin/get-flagged-user')
            .then(({data}) => data)
            .catch(({response}) => Promise.reject(response.data));
    },
};

export default admin;
