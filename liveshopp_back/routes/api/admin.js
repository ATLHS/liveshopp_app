const router = require('express').Router();
const {verifyJwt} = require('../../middleware/verifyJwt');
const BannedUsers = require('../../models/banned');
const UserSeller = require("../../models/seller");
const User = require("../../models/user");
const {updateCustomer} = require("../../utils/updateCustomer");
const Reported = require("../../models/reported");


router.get('/get-banned-users', verifyJwt, async (req, res) => {
    const bannedUsers = await BannedUsers.find();

    if (bannedUsers) {
        return res.status(200).json({
            bannedUsers
        });
    } else {
        return res.status(400).json({
            message: "Oops ! Un probleme est survenu, réessayez plus tard.",
        });
    }

});

router.post('/unban-user', verifyJwt, async (req, res) => {
    const {id} = req.body.data;
    const user = await User.findOne({_id: id});
    const seller = await UserSeller.findOne({_id: id});

    const customer = user || seller;

    if (customer) {
        const updatedCustomer = await updateCustomer(customer, {isBanned: false}, false);
        if (updatedCustomer) {
            const bannedUser = await BannedUsers.findOneAndDelete({id: id});
            const reportedUser = await Reported.findOneAndDelete({id: id});
            const bannedUsers = await BannedUsers.find();

            if (bannedUser) {
                return res.status(200).json({
                    message: `L'utilisateur ${customer.company_name || customer.firstname} n'ai plus banni`,
                    bannedUsers,
                });
            } else {
                return res.status(400).json({
                    message: "Oops ! Un probleme est survenu, réessayez plus tard.",
                });
            }
        } else {
            return res.status(400).json({
                message: "Oops ! Un probleme est survenu, réessayez plus tard..",
            });
        }
    } else {
        return res.status(400).json({
            message: "Oops ! Un probleme est survenu, réessayez plus tard...",
        });
    }
});

router.post('/ban-user', verifyJwt, async (req, res) => {
    // get the id to ban
    let id;
    if (req.body.data.sellerId) {
        id = req.body.data.sellerId;
        await Reported.findOneAndUpdate({flag_user_id: req.body.data.flag_user_id}, {isBlocked: true});
    }
    ;
    if (req.body.data.item) {
        id = req.body.data.item.userId;
        await Reported.findOneAndUpdate({flag_user_id: req.body.data.flag_user_id}, {isBlocked: true});
    }
    ;
    if (req.body.data.flag_user_id) {
        id = req.body.data.flag_user_id;
        await Reported.findOneAndUpdate({flag_user_id: req.body.data.flag_user_id}, {isBlocked: true});
    }
    ;

    const liveData = req.body.data || req.body.data.liveData;

    const user = await User.findById(id);
    const seller = await UserSeller.findById(id);

    const customer = user || seller;


    if (customer) {
        if (customer.isBanned) {
            return res.status(400).json({
                message: `L'utilisateur ${customer.company_name || customer.firstname} est déjà banni`,
            });
        }

        const bannedUser = new BannedUsers({
            id: customer._id,
            firstname: customer.firstname,
            lastname: customer.lastname,
            profil: customer.profil,
            phone: customer.phone || '',
            email: customer.email,
            company_name: customer.company_name || '',
        });
        const isSave = await bannedUser.save();

        if (isSave) {
            const updatedCustomer = await updateCustomer(customer, {isBanned: true}, false);
            if (updatedCustomer) {

                io.emit('banUser', {updatedCustomer, liveData});
                return res.status(200).json({
                    message: `L'utilisateur ${customer.company_name || customer.firstname} a bien été banni`
                });
            } else {
                return res.status(400).json({
                    message: "Oops ! Un probleme est survenu, réessayez plus tard.",
                });
            }
        } else {
            return res.status(400).json({
                message: "Oops ! Un probleme est survenu, réessayez plus tard.",
            });
        }
    } else {
        return res.status(400).json({
            message: "Oops ! Un probleme est survenu, réessayez plus tard.",
        });
    }
});

router.get('/get-flagged-user', verifyJwt, async (req, res) => {
    const flaggedUsers = await Reported.find({isBlocked: false});

    if (flaggedUsers) {
        return res.status(200).json({
            flaggedUsers
        });
    } else {
        return res.status(400).json({
            message: "Oops ! Un probleme est survenu, réessayez plus tard.",
        });
    }
});

module.exports = router;
