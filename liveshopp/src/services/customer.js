import axiosConfig from './config/axiosConfig';

const customer = {
    updateCustomerProfil(data) {
        return axiosConfig
            .post('/api/customer/update-customer-profil', {data})
            .then(({data}) => data)
            .catch(({response}) => Promise.reject(response.data));
    },
    updateCustomerShippingAdrress(data) {
        return axiosConfig
            .post('/api/customer/update-user-shipping-address', {data})
            .then(({data}) => data)
            .catch(({response}) => Promise.reject(response.data));
    },
    updateCustomerPaymentMethodStatut(data) {
        return axiosConfig
            .post('/api/customer/update-user-payment-method-status', {data})
            .then(({data}) => data)
            .catch(({response}) => Promise.reject(response.data));
    },
    deleteCustomer(data) {
        return axiosConfig
            .post('/api/customer/delete-customer', {data})
            .then(({data}) => data)
            .catch(({response}) => Promise.reject(response.data));
    },
    signalCustomer(data) {
        return axiosConfig
            .post('/api/customer/signal-customer', {data})
            .then(({data}) => data)
            .catch(({response}) => Promise.reject(response.data));
    },
    getBlockedUser() {
        return axiosConfig
            .get('/api/customer/get-blocked-user')
            .then(({data}) => data)
            .catch(({response}) => Promise.reject(response.data));
    },
    unblockUser(data) {
        return axiosConfig
            .post('/api/customer/unblock-user', {data})
            .then(({data}) => data)
            .catch(({response}) => Promise.reject(response.data));
    },
    blockUser(data) {
        return axiosConfig
            .post('/api/customer/block', {data})
            .then(({data}) => data)
            .catch(({response}) => Promise.reject(response.data));
    },
    setProfilPicture(data) {
        return axiosConfig
            .post('/api/customer/set-profil-picture', {data})
            .then(({data}) => data)
            .catch(({response}) => Promise.reject(response.data));
    },
    signalAuctionVideo(data) {
        return axiosConfig
            .post('/api/customer/signal-auction-video', {data})
            .then(({data}) => data)
            .catch(({response}) => Promise.reject(response.data));
    },
    deleteProfilPicture() {
        return axiosConfig
            .delete('/api/customer/delete-profil-picture', {})
            .then(({data}) => data)
            .catch(({response}) => Promise.reject(response.data));
    },
    getSellers() {
        return axiosConfig
            .get('/api/customer/get-sellers')
            .then(({data}) => data)
            .catch(({response}) => Promise.reject(response.data));
    },
};

export default customer;
