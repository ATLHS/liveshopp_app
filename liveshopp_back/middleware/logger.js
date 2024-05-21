const morgan = require('morgan');
const winston = require('winston');

/**
 * @type {winston.Logger}
 */
const log = winston.createLogger({
  exitOnError: false,
  level: 'http',
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

// morgan('[:date[clf]] :remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"')
const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream: {
    write: (message) => log.http(message),
  },
});

module.exports = { log, morganMiddleware };
