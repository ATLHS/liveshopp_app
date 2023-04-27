import axios from 'axios';
import {REACT_APP_BASE_URL} from '@env';

const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: REACT_APP_BASE_URL,
});

export default axiosInstance;
