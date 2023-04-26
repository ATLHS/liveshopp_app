import axiosConfig from './config/axiosConfig';

const seller = {
  fetchPaymentSheet() {
    return axiosConfig
      .post('/api/stripe/payment-sheet')
      .then(({data}) => data)
      .catch(({response}) => Promise.reject(response.data));
  },
};

export default seller;
