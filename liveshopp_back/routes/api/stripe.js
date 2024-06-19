const router = require('express').Router();
const Sentry = require('@sentry/node');
const { stripe } = require('../../utils/services');
const stripeUtils = require('../../utils/stripeUtils');
const { verifyJwt } = require('../../middleware/verifyJwt');
const User = require('../../models/user');
const Seller = require('../../models/seller');

router.post('/payment-sheet', verifyJwt, async (req, res) => {
  try {
    // Use an existing Customer ID if this is a returning customer.
    const { id } = req.user;
    const user = await User.findById(id);
    const seller = await Seller.findById(id);

    const customer = user || seller;
    const stripeCustomer = await stripeUtils.retrieveCustomer(customer.stripeCustomerId);

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: stripeCustomer.id },
      { apiVersion: '2022-11-15' },
    );
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomer.id,
    });

    return res.status(200).json({
      setupIntent: setupIntent.client_secret,
      customer: stripeCustomer.id,
      publishableKey: process.env.STRIPE_PUBLIC_KEY,
      ephemeralKey: ephemeralKey.secret,
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
});

module.exports = router;
