const UserSeller = require('../models/seller');
const User = require('../models/user');

const updateCustomer = async (customer, data, isRef) => {
  const userOrSeller = customer.profil === 'seller' ? UserSeller : User;
  return await userOrSeller
    .findOneAndUpdate({ _id: customer.id || customer._id }, isRef ? { $push: data } : data, { new: true })
    .exec();
};

module.exports = { updateCustomer };
