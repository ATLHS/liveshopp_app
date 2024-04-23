const router = require('express').Router();
const User = require('../../models/user');
const Seller = require('../../models/seller');
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);
const stripeUtils = require('../../utils/stripeUtils');
const { verifyJwt } = require('../../middleware/verifyJwt');

router.post('/payment-sheet', verifyJwt, async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const { id } = req.user;
  const user = await User.findOne({ _id: id });
  const seller = await Seller.findOne({ _id: id });

  const customer = user || seller;
  const stripeCustomer = await stripeUtils.retrieveCustomer(customer.stripeCustomerId);
  if (stripeCustomer) {
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomer.id,
    });

    res.status(200).json({
      setupIntent: setupIntent.client_secret,
      customer: stripeCustomer.id,
      publishableKey: process.env.STRIPE_TEST_PUBLIC_KEY,
    });
  } else {
    return res.status(400).json({
      message: 'Un probleme est survenu, réessayez plus tard.',
    });
  }
});

module.exports = router;
