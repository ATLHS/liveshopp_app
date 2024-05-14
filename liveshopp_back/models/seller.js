const mongoose = require("mongoose")

const sellerSchema = new mongoose.Schema(
    {
        firstname: {type: String},
        lastname: {type: String},
        profil: {type: String, default: 'seller'},
        role: {type: String},
        phone: {type: String},
        email: {type: String},
        company_name: {type: String},
        bio: {type: String},
        tiktok: {type: String},
        instagram: {type: String},
        websiteUrl: {type: String},
        business_activity: {type: String},
        password: {type: String},
        isConfirmed: {type: Boolean, default: false},
        registeredConfirmedCode: {type: Number, default: 0},
        stripeCustomerId: {type: String},
        hasValidPaymentMethod: {type: Boolean, default: false},
        shipping_address: {type: String, default: ''},
        imageUrl: {type: String, default: ''},
        resetPasswordCode: {type: Number, default: 0},
        blockedUser: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        blockedSeller: [{type: mongoose.Schema.Types.ObjectId, ref: 'Seller'}],
        isBanned: {type: Boolean, default: false},
    },
    {timestamps: true},
)

const Seller = mongoose.model("Seller", sellerSchema)

module.exports = Seller
