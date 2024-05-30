import axiosConfig from './config/axiosConfig';

const auth = {
  isAuthenticate() {
    return axiosConfig.get('/api/auth/is-authenticate').then(({ data }) => data);
  },
  handleUserSignIn(data) {
    return axiosConfig.post('/api/auth/user-signin', { data }).then(({ data }) => data);
  },
  handleUserSignup(data) {
    return axiosConfig.post('/api/auth/user-signup', { data }).then(({ data }) => data);
  },
  handleSellerSignup(data) {
    return axiosConfig.post('/api/auth/seller-signup', { data }).then(({ data }) => data);
  },
  handleEmailVerificationCode(data) {
    return axiosConfig.post('/api/auth/confirm-user-email', { data }).then(({ data }) => data);
  },
  resetPassword(data) {
    return axiosConfig.post('/api/auth/reset-password', { data }).then(({ data }) => data);
  },
  checkResetPasswordCode(data) {
    return axiosConfig
      .post('/api/auth/check-reset-password-code', { data })
      .then(({ data }) => data);
  },
  resetCustomerPassword(data) {
    return axiosConfig.post('/api/auth/reset-customer-password', { data }).then(({ data }) => data);
  },
};

export default auth;
