const mongoose = require('mongoose');

const AuctionVideoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'docModel'
    },
    docModel: {
        type: String,
        required: true,
        enum: ['Seller', 'User']
    },
    amount: {
        type: Number,
    },
    auctionItemStatus: { type: String, default: 'onGoing' },
    auctionItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VideosItem'
    }
});

const AuctionVideoItem = mongoose.model('auction_video_item', AuctionVideoSchema);

module.exports = AuctionVideoItem;
