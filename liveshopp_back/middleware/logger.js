const morgan = require('morgan');
const winston = require('winston');

const isDevEnv = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development';
};

/**
 * @type {winston.Logger}
 */
const log = winston.createLogger({
  exitOnError: false,
  level: isDevEnv ? 'debug' : 'http',
  format: winston.format.combine(
    winston.format.colorize({ all: isDevEnv }),
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
