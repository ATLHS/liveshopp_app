const mongoose = require('mongoose');

const lives = new mongoose.Schema(
  {
    seller_id: { type: String },
    sellerName: { type: String },
    live_name: { type: String },
    live_description: { type: String },
    live_date_time: { type: String },
    live_status: { type: String, default: 'coming_soon' },
    business_activity: { type: String },
    imageUrl: { type: String, default: '' },
    pinned_message: { type: String },
  },
  { timestamps: true },
);

const Live = mongoose.model('Live', lives);

/**
 * @typedef {typeof Live.schema.obj} LiveType
 */

module.exports = Live;
