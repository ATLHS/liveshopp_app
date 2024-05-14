const mongoose = require('mongoose');

const product = new mongoose.Schema(
    {
        seller: {type: mongoose.Schema.Types.ObjectId, ref: 'Seller'},
        live_name: {type: String},
            auctionType: {
                    type: String,
                    enum: ['Live enchères', 'Vidéo enchères']
            },
        auctionId: {type: String},
        auctionsStatus: {
            type: String,
            enum: ['live', 'ended']
        },
        userId: {type: String},
        productName: {type: String},
        salePrice: {type: String},
        deliveryStatut: {type: String, default: 'En attente d\'expédition'},
        shipping_address: {type: String, default: ''},
    },
    {timestamps: true},
)

const Product = mongoose.model('Product', product);

module.exports = Product;
