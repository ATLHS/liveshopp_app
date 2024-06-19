const router = require('express').Router();
const Sentry = require('@sentry/node');
const { verifyJwt } = require('../../middleware/verifyJwt');
const Product = require('../../models/product');

router.get('/get-user-order', verifyJwt, async (req, res) => {
  try {
    const order = await Product.find({ $or: [{ userId: req.user.id }, { seller_id: req.user.id }] }).populate(
      'seller_id',
      '-password -checkedPayment -isConfirmed -registeredConfirmedCode',
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
    const orderId = req.body.data._id;
    await Product.findOneAndUpdate({ _id: orderId }, { deliveryStatut: 'Expédié' }, { new: true });

    const order = await Product.find({ $or: [{ userId: req.user.id }, { seller_id: req.user.id }] }).populate(
      'seller_id',
      '-password -checkedPayment -isConfirmed -registeredConfirmedCode',
    );

    if (order) {
      return res.status(200).json({
        order,
        message: req.t('articleUpdatedStatusShipped', { productName: req.body.data.productName }),
      });
    }

    return res.status(400).json({ message: req.t('errorTryAgainLater') });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
});

module.exports = router;
