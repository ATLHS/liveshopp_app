import axios from 'axios';
import {REACT_APP_BASE_URL, REACT_APP_LOCAL_URL} from '@env';
import * as Sentry from '@sentry/react-native';

const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: REACT_APP_BASE_URL,
});

// Intercepts all requests (like a middleware)
//
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // The server responded with a status code outside the 2xx range
            console.error('Error response:', error.response);
            Sentry.captureException(error, error.response);

            if (error.response.data) {
                return Promise.reject(error.response.data);
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

export default axiosInstance;
