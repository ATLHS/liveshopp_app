const {io} = require('socket.io-client');
import {REACT_APP_BASE_URL} from '@env';


module.exports = io("http://192.168.1.170:5000");
