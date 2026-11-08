const Sentry = require('@sentry/node');
const User = require('../models/user');
const Seller = require('../models/seller');

const requireAdmin = async (req, res, next) => {
  try {
    const customer = req.customer || (await User.findById(req.user.id)) || (await Seller.findById(req.user.id));
    if (!customer || customer.profil !== 'admin' || customer.isBanned) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
};

module.exports = { requireAdmin };
