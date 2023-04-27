import axios from 'axios';
import {BASE_URL} from '@env';

const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: BASE_URL,
});

export default axiosInstance;
