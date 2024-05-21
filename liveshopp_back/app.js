require('dotenv').config();
require('./instrument');

const express = require('express');
const Sentry = require('@sentry/node');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { morganMiddleware, log } = require('./middleware/logger');
const registerChannelHandlers = require('./utils/socketHandler');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

global.io = io;

io.on('connection', (socket) => {
  registerChannelHandlers(io, socket);
});

app.use(morganMiddleware);
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
    limit: '35mb',
    parameterLimit: 50000,
  }),
);
app.use(express.json({ limit: '35mb' }));
app.use(express.static('public'));

const auth = require('./routes/api/auth');
const customer = require('./routes/api/customer');
const live = require('./routes/api/live');
const order = require('./routes/api/order');
const stripe = require('./routes/api/stripe');
const admin = require('./routes/api/admin');
const videos = require('./routes/api/video');

app.use('/api/auth/', auth);
app.use('/api/customer/', customer);
app.use('/api/live/', live);
app.use('/api/order/', order);
app.use('/api/stripe/', stripe);
app.use('/api/admin/', admin);
app.use('/api/videos/', videos);

Sentry.setupExpressErrorHandler(app);

httpServer.listen(process.env.PORT, () => {
  log.info(`Server listening on port ${process.env.PORT}`);
});

module.exports = { app, httpServer };
