import axios from 'axios';
import {REACT_APP_BASE_URL} from '@env';

// "http://192.168.1.170:5000",

const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: REACT_APP_BASE_URL,
});

export default axiosInstance;
