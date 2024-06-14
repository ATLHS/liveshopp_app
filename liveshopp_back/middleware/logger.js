const morgan = require('morgan');
const winston = require('winston');

const formats = () => {
  if (process.env.NODE_ENV === 'production') {
    return winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
      }),
      winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
    );
  } else {
    return winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.errors({ stack: true }),
      winston.format.timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
      }),
      winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
    );
  }
};

/**
 * @type {winston.Logger}
 */
const log = winston.createLogger({
  exitOnError: false,
  level: process.env.NODE_ENV === 'production' ? 'http' : 'debug',
  format: formats(),
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
