import axiosConfig from './config/axiosConfig';

const customer = {
  updateCustomerProfil(data) {
    console.log(data);
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
      .post('/api/customer/update-user-payment-method-statut', {data})
      .then(({data}) => data)
      .catch(({response}) => Promise.reject(response.data));
  },
  deleteCustomer(data) {
    return axiosConfig
      .post('/api/customer/delete-customer', {data})
      .then(({data}) => data)
      .catch(({response}) => Promise.reject(response.data));
  },
};

export default customer;
