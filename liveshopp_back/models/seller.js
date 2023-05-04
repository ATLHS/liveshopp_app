const mongoose = require("mongoose")

const Schema = new mongoose.Schema()

const sellerSchema = new mongoose.Schema(
    {
        firstname: {type: String},
        lastname: {type: String},
        profil: {type: String, default: 'seller'},
        role: {type: String},
        phone: {type: String},
        email: {type: String},
        company_name: {type: String},
        business_activity: {type: String},
        password: {type: String},
        isConfirmed: {type: Boolean, default: false},
        registeredConfirmedCode: {type: Number, default: 0},
        stripeCustomerId: {type: String},
        hasValidPaymentMethod: {type: Boolean, default: false},
        shipping_address: {type: String, default: ''},
        imageUrl: {type: String, default: ''},
        blockedUser: [{type: mongoose.Schema.Types.ObjectId, default: 'User'}],
        blockedSeller: [{type: mongoose.Schema.Types.ObjectId, default: 'Seller'}],

    },
    {timestamps: true},
)

const Seller = mongoose.model("Seller", sellerSchema)

module.exports = Seller
