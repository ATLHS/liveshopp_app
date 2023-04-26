const mongoose = require("mongoose")

const Schema = new mongoose.Schema()

const lives = new mongoose.Schema(
    {
        seller_id: {type: String},
        sellerName: {type: String},
        live_name: {type: String},
        live_description: {type: String},
        live_date_time: {type: String},
        live_status: {type: String, default: 'coming_soon'},
        business_activity: {type: String},
        imageUrl: {type: String, default: ''},
    },
    {timestamps: true},
)

const Live = mongoose.model("Live", lives)

module.exports = Live
