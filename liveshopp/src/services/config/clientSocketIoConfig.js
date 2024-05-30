import apiConfig from '../config/apiConfig';

const { io } = require('socket.io-client');

module.exports = io(apiConfig.URL);
