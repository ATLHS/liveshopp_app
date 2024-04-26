const UserSeller = require("../models/seller");
const User = require("../models/user");


module.exports = {
    updateCustomer: async (customer, data, isRef) => {
        const isSeller = customer.profil === 'seller';
        if (isSeller) {
            return UserSeller.findOneAndUpdate(
                {_id: customer.id},
                isRef ? {
                    $push: data,
                } : data,
                {
                    new: true,
                }
            );
        } else {
            return User.findOneAndUpdate(
                {_id: customer.id},
                isRef ? {
                    $push: data,
                } : data,
                {
                    new: true,
                }
            );
        }
    },
};



