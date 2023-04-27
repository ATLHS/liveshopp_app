const {io} = require('socket.io-client');
import {BASE_URL} from '@env';

module.exports = socket = io(BASE_URL);
