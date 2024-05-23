const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String },
    lastname: { type: String },
    profil: { type: String, default: 'user' },
    phone: { type: String },
    email: { type: String },
    password: { type: String },
    isConfirmed: { type: Boolean, default: false },
    registeredConfirmedCode: { type: Number, default: 0 },
    stripeCustomerId: { type: String },
    hasValidPaymentMethod: { type: Boolean, default: false },
    shipping_address: { type: String, default: '' },
    resetPasswordCode: { type: Number, default: 0 },
    blockedUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    blockedSeller: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }],
    isBanned: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

/**
 * @typedef {typeof User.schema.obj} UserType
 */

module.exports = User;
