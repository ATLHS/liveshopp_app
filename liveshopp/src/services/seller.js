import axiosConfig from './config/axiosConfig';

const seller = {
  getSellerLives() {
    return axiosConfig
      .get('/api/live/get-seller-live')
      .then(({data}) => data)
      .catch(({response}) => Promise.reject(response.data));
  },
  createNewLive(data) {
    return axiosConfig
      .post('/api/live/create-live', {data})
      .then(({data}) => data)
      .catch(({response}) => Promise.reject(response.data));
  },
};

export default seller;
