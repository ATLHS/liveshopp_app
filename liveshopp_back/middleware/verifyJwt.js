const jwt = require('jsonwebtoken');
const Sentry = require('@sentry/node');
const User = require('../models/user');
const Seller = require('../models/seller');

const verifyJwt = async (req, res, next) => {
  try {
    const match = /^Bearer (\S+)$/.exec(req.headers.authorization || '');
    if (!match) {
      return res.status(401).json({
        isAuthenticate: false,
        message: 'Request not authenticated: No token provided',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(match[1], process.env.JWT_SECRET);
    } catch (_error) {
      return res.status(401).json({ isAuthenticate: false, message: 'Request not authenticated: Invalid token' });
    }

    const customer = (await User.findById(decoded.id)) || (await Seller.findById(decoded.id));
    if (!customer || customer.isBanned) {
      return res.status(403).json({ isAuthenticate: false, message: 'Account unavailable' });
    }

    req.user = { id: customer.id, email: customer.email };
    req.customer = customer;
    next();
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: 'A problem occured' });
  }
};

module.exports = { verifyJwt };
