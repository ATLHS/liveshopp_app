const UserSeller = require('../models/seller');
const User = require('../models/user');

module.exports = {
  // FIXME
  //
  // Missing data validation here
  // Potentially a user could send random data
  // and it will be saved as it
  //
  // Same comment everywhere it receives data from user
  // It's super unsafe to trust what they send
  //
  updateCustomer: async (customer, data, isRef) => {
    const isSeller = customer.profil === 'seller';
    if (isSeller) {
      return UserSeller.findOneAndUpdate(
        { _id: customer.id },
        isRef
          ? {
              $push: data,
            }
          : data,
        {
          new: true,
        },
      );
    } else {
      return User.findOneAndUpdate(
        { _id: customer.id },
        isRef
          ? {
              $push: data,
            }
          : data,
        {
          new: true,
        },
      );
    }
  },
};
