require('dotenv').config();
require('./instrument');

const express = require('express');
const Sentry = require('@sentry/node');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');
const { morganMiddleware, log } = require('./middleware/logger');
const registerChannelHandlers = require('./utils/socketHandler');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  connectionStateRecovery: {},
  // maxHttpBufferSize
  // pingTimeout
});

io.on('connection', (socket) => {
  log.debug(`[socket.io] A user just connected ${socket.id}`);

  registerChannelHandlers(io, socket);

  if (socket.recovered) {
    log.debug('[socket.io] Socket recovered');
  } else {
    log.debug('[socket.io] Socket NOT recovered');
  }

  socket.on('disconnect', (reason, details) => {
    log.debug(`[socket.io] User disconnected: ${reason} ${details}`);
  });

  socket.onAny((eventName, ...args) => {
    log.debug(`[socket.io] Receiving ${eventName}`);
    log.debug(args);
  });

  socket.onAnyOutgoing((eventName, ...args) => {
    log.debug(`[socket.io] Sending ${eventName}`);
    log.debug(args);
  });
});

io.engine.on('connection_error', (err) => {
  log.debug('[socket.io] On connection error:');
  log.debug(err.req); // the request object
  log.debug(err.code); // the error code, for example 1
  log.debug(err.message); // the error message, for example "Session ID unknown"
  log.debug(err.context); // some additional error context
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

process.on('uncaughtException', (error) => {
  log.error(`Caught exception: ${error}\n` + `Exception origin: ${error.stack}`);
});

process.on('unhandledRejection', (reason, promise) => {
  log.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

Sentry.setupExpressErrorHandler(app);

httpServer.listen(process.env.PORT, () => {
  log.info(`Server listening on port ${process.env.PORT}`);
});

module.exports = { app, httpServer };
