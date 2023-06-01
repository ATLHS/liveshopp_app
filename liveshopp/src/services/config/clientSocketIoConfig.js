const {io} = require('socket.io-client');
import {REACT_APP_BASE_URL} from '@env';

module.exports = io(REACT_APP_BASE_URL);

