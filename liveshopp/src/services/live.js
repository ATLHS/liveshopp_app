import axiosConfig from './config/axiosConfig';

const live = {
  getAgoraToken(channelName) {
    return axiosConfig
      .post('/api/live/get-agora-token', {data: {channelName}})
      .then(({data}) => data)
      .catch(({response}) => Promise.reject(response.data));
  },
  getLives() {
    return axiosConfig
      .get('/api/live/get-lives')
      .then(({data}) => data)
      .catch(({response}) => Promise.reject(response.data));
  },
  closeLive(data) {
    return axiosConfig
      .post('/api/live/close-live', {data})
      .then(({data}) => data)
      .catch(({response}) => Promise.reject(response.data));
  },
  deleteLive(data) {
    return axiosConfig
      .post('/api/live/delete-live', {data})
      .then(({data}) => data)
      .catch(({response}) => Promise.reject(response.data));
  },
};

export default live;
