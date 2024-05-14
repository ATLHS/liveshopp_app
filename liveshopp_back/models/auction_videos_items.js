const mongoose = require("mongoose");

const AuctionVideoItemSchema = new mongoose.Schema(
    {
        seller_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Seller"
        },
        sellerName: String,
        productName: String,
        productDescription: String,
        startingPrice: Number,
        reservePrice: Number,
        currentPrice: { type: Number, default: 0 },
        videoUrl: String,
        auctionEndDate: Date,
        auctionStatus: { type: String, default: 'onGoing' },
        finalSalePrice: { type: String, default: '' },
        shipping_address: { type: String, default: '' },
        bestBidderUsername: { type: String, default: '' },
        winningBidderId: {
                type: mongoose.Schema.Types.ObjectId,
                refPath: 'docModel'
        },
            docModel: {
                    type: String,
                    enum: ['Seller', 'User']
            },
        winningBidderUsername: { type: String, default: '' },
        isReportedForModeration: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const VideosItem = mongoose.model("VideosItem", AuctionVideoItemSchema);

module.exports = VideosItem;

