const {io} = require('socket.io-client');
import {REACT_APP_BASE_URL} from '@env';

// "http://192.168.1.170:5000"

module.exports = io(REACT_APP_BASE_URL);