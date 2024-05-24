const morgan = require('morgan');
const winston = require('winston');

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'http';
};

/**
 * @type {winston.Logger}
 */
const log = winston.createLogger({
  exitOnError: false,
  level: level(),
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.errors({ stack: true }),
    winston.format.timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports: [new winston.transports.Console()],
});

const httpLogFormat =
  process.env.NODE_ENV === 'production'
    ? ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
    : ':status :method :url - :response-time ms';

const morganMiddleware = morgan(httpLogFormat, {
  stream: {
    write: (message) => log.http(message.trim()),
  },
});

module.exports = { log, morganMiddleware };
