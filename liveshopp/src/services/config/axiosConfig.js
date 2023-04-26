import axios from 'axios';

const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: "http://192.168.1.170:5000",
});

export default axiosInstance;
