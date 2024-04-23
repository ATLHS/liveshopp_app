const router = require('express').Router();
const { verifyJwt } = require('../../middleware/verifyJwt');
const Product = require('../../models/product');

router.get('/get-user-order', verifyJwt, async (req, res) => {
  const order = await Product.find({ $or: [{ userId: req.user.id }, { seller_id: req.user.id }] }).populate(
    'seller',
    '-password -checkedPayment -isConfirmed -registeredConfirmedCode',
  );
  if (order) {
    return res.status(200).json({ order });
  } else {
    return res.status(400).json({
      message: 'Un probleme est survenu, réessayez plus tard.',
    });
  }
});

router.post('/update-order-status', verifyJwt, async (req, res) => {
  const orderId = req.body.data._id;
  await Product.findOneAndUpdate({ _id: orderId }, { deliveryStatut: 'Expédié' }, { new: true });

  const order = await Product.find({ $or: [{ userId: req.user.id }, { seller_id: req.user.id }] }).populate(
    'seller',
    '-password -checkedPayment -isConfirmed -registeredConfirmedCode',
  );
  if (order) {
    return res.status(200).json({ order, message: `L'article ${req.body.data.productName} a bien été mis à jour avec le statut : Expédié.` });
  } else {
    return res.status(400).json({
      message: 'Un probleme est survenu, réessayez plus tard.',
    });
  }
});

module.exports = router;
