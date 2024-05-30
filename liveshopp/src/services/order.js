import axiosConfig from './config/axiosConfig';

const live = {
  getAllOrder() {
    return axiosConfig
      .get('/api/order/get-user-order')
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response.data));
  },
  updateOrderStatus(data) {
    return axiosConfig
      .post('/api/order/update-order-status', { data })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response.data));
  },
};

export default live;
