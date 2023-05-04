const mongoose = require("mongoose")

const Schema = new mongoose.Schema()

const userSchema = new mongoose.Schema(
    {
        firstname: {type: String},
        lastname: {type: String},
        profil: {type: String, default: 'user'},
        email: {type: String},
        password: {type: String},
        isConfirmed: {type: Boolean, default: false},
        registeredConfirmedCode: {type: Number, default: 0},
        stripeCustomerId: {type: String},
        hasValidPaymentMethod: {type: Boolean, default: false},
        shipping_address: {type: String, default: ''},
        blockedUser: [{type: mongoose.Schema.Types.ObjectId, default: 'User'}],
        blockedSeller: [{type: mongoose.Schema.Types.ObjectId, default: 'Seller'}],
    },
    {timestamps: true},
)

const User = mongoose.model("User", userSchema)

module.exports = User
