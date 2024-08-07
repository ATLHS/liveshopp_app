const jwt = require('jsonwebtoken');
const _ = require('lodash');
const Sentry = require('@sentry/node');

const verifyJwt = (req, res, next) => {
  try {
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (bearerHeader) {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            isAuthenticate: false,
            message: 'Request not authenticated: Invalid token',
          });
        }
        req.user = _.pick(decoded, ['id', 'email']);
        next();
      });
    } else {
      return res.status(401).json({
        isAuthenticate: false,
        message: 'Request not authenticated: No token provided',
      });
    }
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: 'A problem occured' });
  }
};

module.exports = { verifyJwt };
