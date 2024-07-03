const mongoose = require('mongoose');
const { orderDeliveryStatus } = require('../constants/OrderDeliveryStatus');

const product = new mongoose.Schema(
  {
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
    live_name: { type: String },
    auctionType: {
      type: String,
      enum: ['Live enchères', 'Vidéo enchères'],
    },
    auctionId: { type: String },
    auctionsStatus: {
      type: String,
      enum: ['live', 'ended'],
    },
    userId: { type: mongoose.Schema.Types.ObjectId, refPath: 'docModel' },
    docModel: {
      type: String,
      enum: ['Seller', 'User'],
    },
    productName: { type: String },
    salePrice: { type: String },
    deliveryStatut: { type: String, default: orderDeliveryStatus.PENDING },
    shipping_address: { type: String, default: '' },
  },
  { timestamps: true },
);

const Product = mongoose.model('Product', product);

module.exports = Product;
