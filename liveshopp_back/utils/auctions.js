const Sentry = require('@sentry/node');
const stripeUtils = require('./stripeUtils');
const { log } = require('../middleware/logger');

const Product = require('../models/product');
const User = require('../models/user');
const UserSeller = require('../models/seller');

// FIXME
//
// Ideally, this would be done asynchronously in a job queue
//
const registerAuction = async ({ auction, auctionId, auctionsStatus, sellerId, sellerName }) => {
  try {
    const customer =
      (await User.findOne({ _id: auction.userId })) || (await UserSeller.findOne({ _id: auction.userId }));

    const paymentIntentMetadata = {
      seller_id: sellerId,
      seller_name: sellerName,
      amount: auction.currentProductAmount,
    };
    const amountToCharge = parseInt(auction.currentProductAmount.toString() * 100);
    const paymentIntent = await stripeUtils.chargeCustomer(
      amountToCharge,
      customer.stripeCustomerId,
      paymentIntentMetadata,
    );

    if (paymentIntent.status !== 'succeeded') {
      Sentry.captureMessage('Register auction Stripe error:', 'error');
      log.error('Register auction Stripe error:');
      log.error(paymentIntent);

      // FIXME
      //
      // We don't want to create a Product in DB if the payment didn't go through for now.
      //
      return;
    }

    const model = customer.profil === 'user' ? 'User' : 'Seller';

    // register current sale product info in db
    const product = new Product({
      seller_id: sellerId,
      live_name: 'Live enchères',
      auctionId: auctionId,
      auctionsStatus: auctionsStatus,
      userId: auction.userId,
      docModel: model,
      productName: auction.productName,
      salePrice: auction.currentProductAmount,
      shipping_address: auction.shipping_address,
    });

    await product.save();

    log.info(`Transaction succeeded for product ${auction.productName} sold to ${customer.email}`);
  } catch (error) {
    Sentry.captureException(error);
    log.error('Register auction error:');
    log.error(error);
  }
};

module.exports = { registerAuction };
