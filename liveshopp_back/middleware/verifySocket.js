const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Seller = require('../models/seller');

const verifySocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (typeof token !== 'string' || !token) {
      return next(new Error('Unauthorized'));
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const customer = (await User.findById(id)) || (await Seller.findById(id));
    if (!customer || customer.isBanned) {
      return next(new Error('Unauthorized'));
    }

    socket.data.user = {
      id: customer.id,
      profil: customer.profil,
      firstname: customer.firstname,
      lastname: customer.lastname,
      shipping_address: customer.shipping_address,
      hasValidPaymentMethod: customer.hasValidPaymentMethod,
    };
    next();
  } catch (_error) {
    next(new Error('Unauthorized'));
  }
};

module.exports = { verifySocket };
