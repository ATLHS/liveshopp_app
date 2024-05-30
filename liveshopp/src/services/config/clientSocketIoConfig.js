import { REACT_APP_BASE_URL, REACT_APP_LOCAL_URL } from '@env';

const { io } = require('socket.io-client');

module.exports = io(REACT_APP_BASE_URL);
