const router = require('express').Router();
const Sentry = require('@sentry/node');
const { verifyJwt } = require('../../middleware/verifyJwt');
const Product = require('../../models/product');
const { orderDeliveryStatus } = require('../../constants/OrderDeliveryStatus');

router.get('/get-user-order', verifyJwt, async (req, res) => {
  try {
    // Retrieve all orders where the user is either a buyer or a seller.
    // This includes orders ( as buyer )
    // and orders to ship or shipped if the request is made ( as seller )
    const order = await Product.find({ $or: [{ userId: req.user.id }, { seller_id: req.user.id }] }).populate(
      'seller_id userId',
      // TO DO : we should exclude sensitive data at the model level
      '-password -checkedPayment -isConfirmed -registeredConfirmedCode -stripeCustomerId -hasValidPaymentMethod -resetPasswordCode -blockedUser -blockedSeller',
    );

    if (order) {
      return res.status(200).json({ order });
    }

    return res.status(400).json({ message: req.t('errorTryAgainLater') });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
});

router.post('/update-order-status', verifyJwt, async (req, res) => {
  try {
    const {
      selectedOrder: { _id },
      trackingUrl,
    } = req.body.data;

    const updatedOrder = await Product.findOneAndUpdate(
      { _id },
      { deliveryStatut: orderDeliveryStatus.SHIPPED, trackingUrl },
      { new: true },
    ).populate(
      'seller_id userId',
      // TO DO : we should exclude sensitive data at the model level
      '-password -checkedPayment -isConfirmed -registeredConfirmedCode -stripeCustomerId -hasValidPaymentMethod -resetPasswordCode -blockedUser -blockedSeller',
    );

    if (updatedOrder) {
      return res.status(200).json({
        updatedOrder,
        message: req.t('articleUpdatedStatusShipped', { productName: updatedOrder.productName }),
      });
    }

    return res.status(400).json({ message: req.t('errorTryAgainLater') });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
});

module.exports = router;
