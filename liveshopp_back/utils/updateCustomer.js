const UserSeller = require("../models/seller");
const User = require("../models/user");


module.exports = {
    updateCustomer: async (customer, data) => {
        const isSeller = customer.profil === 'seller';
        if (isSeller) {
            return UserSeller.findOneAndUpdate(
                {_id: customer.id},
                data,
                {
                    new: true,
                }
            );
        } else {
            return User.findOneAndUpdate(
                {_id: customer.id},
                data,
                {
                    new: true,
                }
            );
        }
    }
};



