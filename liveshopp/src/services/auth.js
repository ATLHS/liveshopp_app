import axiosConfig from './config/axiosConfig';

const auth = {
  isAuthenticate() {
    return axiosConfig
      .get('/api/auth/is-authenticate')
      .then(({data}) => data)
      .catch(({response}) => Promise.reject(response.data));
  },
  handleUserSignIn(data) {
    return axiosConfig
      .post('/api/auth/user-signin', {data})
      .then(({data}) => data)
      .catch(({response}) => console.log(response));
  },
  handleUserSignup(data) {
    return axiosConfig
      .post('/api/auth/user-signup', {data})
      .then(({data}) => data)
      .catch(({response}) => Promise.reject(response.data));
  },
  handleSellerSignup(data) {
    return axiosConfig
      .post('/api/auth/seller-signup', {data})
      .then(({data}) => data)
      .catch(({response}) => Promise.reject(response.data));
  },
  handleEmailVerificationCode(data) {
    return axiosConfig
      .post('/api/auth/confirm-user-email', {data})
      .then(({data}) => data)
      .catch(({response}) => Promise.reject(response.data));
  },
};

export default auth;
