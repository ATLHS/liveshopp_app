import axios from 'axios';

import * as Sentry from '@sentry/react-native';

import i18n from '../../../i18n';
import apiConfig from '../config/apiConfig';

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: apiConfig.URL,
});

// Intercepts all responses (like a middleware)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      console.error('Error response:', error.response);
      Sentry.captureException(error, error.response);

      if (error.response.data) {
        return Promise.reject(error);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
      Sentry.captureException(error, error.request);
    } else {
      // Something happened in setting up the request that triggered an error
      console.error('Error message:', error.message);
      Sentry.captureException(error, error.message);
    }
    return Promise.reject(error);
  },
);

// Intercepts all requests (like a middleware)
axiosInstance.interceptors.request.use((config) => {
  const language = i18n.language || 'fr'; // Langue par défaut
  config.headers['Accept-Language'] = language;
  return config;
});

export default axiosInstance;
