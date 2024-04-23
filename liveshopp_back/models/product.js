const mongoose = require('mongoose');

const Schema = new mongoose.Schema();

const product = new mongoose.Schema(
  {
    seller_id: { type: String },
    live_name: { type: String },
    auctionId: { type: String },
    auctionsStatus: { type: String },
    userId: { type: String },
    productName: { type: String },
    salePrice: { type: String },
    deliveryStatut: { type: String, default: "En attente d'expédition" },
    shipping_address: { type: String, default: '' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  },
  { timestamps: true },
);

const Product = mongoose.model('Product', product);

module.exports = Product;
