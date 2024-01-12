const router = require("express").Router();
const {verifyJwt} = require("../../middleware/verifyJwt");
const UserSeller = require("../../models/seller");
const User = require("../../models/user");
const Live = require("../../models/live");
const Product = require("../../models/product");
const Reported = require("../../models/reported");
const {updateCustomer} = require("../../utils/updateCustomer.js");
const stripeUtils = require("../../utils/stripeUtils");
const {sendCodeToConfirmEmailRegistration} = require("../../utils/sendCodeConfirmationEmail");
const BannedUsers = require('../../models/banned');

router.post("/update-customer-profil", verifyJwt, async (req, res) => {
    const user = await User.findById(req.user.id).populate('blockedUser blockedSeller', '_id');
    const seller = await UserSeller.findById(req.user.id).populate('blockedUser blockedSeller', '_id');
    const body = req.body.data;

    const customer = user || seller;
    const data = {
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email,
        phone: body.phone
    };

    if (customer) {
        const updatedCustomer = await updateCustomer(customer, data, false);
        if (updatedCustomer) {
            return res
                .status(200)
                .json({
                    user: {
                        id: updatedCustomer._id,
                        email: updatedCustomer.email,
                        profil: updatedCustomer.profil,
                        firstname: updatedCustomer.firstname,
                        lastname: updatedCustomer.lastname,
                        phone: updatedCustomer.phone || null,
                        role: updatedCustomer.role || null,
                        business_activity: updatedCustomer.business_activity || null,
                        company_name: updatedCustomer.company_name || null,
                        shipping_address: updatedCustomer.shipping_address,
                        hasValidPaymentMethod: customer.hasValidPaymentMethod,
                        imageUrl: customer.imageUrl || null,
                        blockedUser: customer.blockedUser,
                        blockedSeller: customer.blockedSeller
                    },
                    message: "Votre profil a été modifié avec succès.",
                });
        } else {
            return res.status(400).json({
                message: "Un probleme est survenu, réessayez plus tard.",
            });
        }
    } else {
        return res.status(400).json({
            message: "Un probleme est survenu, réessayez plus tard.",
        });
    }
});

router.post("/update-user-shipping-address", verifyJwt, async (req, res) => {
    const user = await User.findOne({_id: req.user.id}).populate('blockedUser blockedSeller', '_id');
    const seller = await UserSeller.findOne({_id: req.user.id}).populate('blockedUser blockedSeller', '_id');

    const customer = user || seller;

    if (customer) {
        const updatedCustomer = await updateCustomer(customer, req.body.data, false);
        if (updatedCustomer) {
            return res
                .status(200)
                .json({
                    user: {
                        id: updatedCustomer._id,
                        email: updatedCustomer.email,
                        profil: updatedCustomer.profil,
                        firstname: updatedCustomer.firstname,
                        lastname: updatedCustomer.lastname,
                        phone: updatedCustomer.phone || null,
                        shipping_address: updatedCustomer.shipping_address,
                        company_name: customer.company_name || null,
                        role: customer.role || null,
                        business_activity: customer.business_activity || null,
                        hasValidPaymentMethod: customer.hasValidPaymentMethod,
                        imageUrl: customer.imageUrl || null,
                        blockedUser: customer.blockedUser,
                        blockedSeller: customer.blockedSeller
                    },
                    message: "Votre adresse de livraison a été modifiée avec succès.",
                });
        } else {
            return res.status(400).json({
                message: "Un probleme est survenu, réessayez plus tard..",
            });
        }
    } else {
        return res.status(400).json({
            message: "Un probleme est survenu, réessayez plus tard.",
        });
    }
});

router.post("/update-user-payment-method-statut", verifyJwt, async (req, res) => {
    const user = await User.findOne({_id: req.user.id}).populate('blockedUser blockedSeller', '_id');
    const seller = await UserSeller.findOne({_id: req.user.id}).populate('blockedUser blockedSeller', '_id');

    const customer = user || seller;

    if (customer) {
        const updatedCustomer = await updateCustomer(customer, {hasValidPaymentMethod: true}, false);
        if (updatedCustomer) {
            return res
                .status(200)
                .json({
                    user: {
                        id: updatedCustomer._id,
                        email: updatedCustomer.email,
                        profil: updatedCustomer.profil,
                        firstname: updatedCustomer.firstname,
                        lastname: updatedCustomer.lastname,
                        phone: updatedCustomer.phone || null,
                        shipping_address: updatedCustomer.shipping_address,
                        company_name: customer.company_name || null,
                        role: customer.role || null,
                        business_activity: customer.business_activity || null,
                        hasValidPaymentMethod: customer.hasValidPaymentMethod,
                        imageUrl: customer.imageUrl || null,
                        blockedUser: customer.blockedUser,
                        blockedSeller: customer.blockedSeller
                    },
                    message: "Votre moyen de paiement a été configuré avec succès.",
                });
        } else {
            return res.status(400).json({
                message: "Un probleme est survenu, réessayez plus tard.",
            });
        }
    } else {
        return res.status(400).json({
            message: "Un probleme est survenu, réessayez plus tard.",
        });
    }
});


router.post("/get-customer", verifyJwt, async (req, res) => {
    const user = await User.findOne({_id: req.user.id});
    const seller = await UserSeller.findOne({_id: req.user.id});

    const customer = user || seller;

    if (customer) {
        return res
            .status(200)
            .json({customer});
    } else {
        return res.status(400).json({
            message: "Un probleme est survenu, réessayez plus tard.",
        });
    }
});

router.post("/delete-customer", verifyJwt, async (req, res) => {
    const user = await User.findOne({_id: req.user.id});
    const seller = await UserSeller.findOne({_id: req.user.id});

    const customer = user || seller;

    // delete all lives from the current sellers profile
    if (customer.profil === "seller") {
        // check if the seller has any unshipped products
        const product = await Product.findOne({seller_id: customer._id, deliveryStatut: "En attente d'expédition"});
        if (product) {
            return res.status(400).json({
                message: "Votre compte ne peut être supprimé, des commandes sont toujours en attente d'expédition.",
            });
        }
        const deleteAllSellerLive = await Live.deleteMany({seller_id: customer._id});
        if (!deleteAllSellerLive.acknowledged) {
            return res.status(400).json({
                message: "Un probleme est survenu, réessayez plus tard.",
            });
        }
    }

    // delete stripe customer
    const deletedCustomer = await stripeUtils.deleteCustomer(customer.stripeCustomerId);
    if (deletedCustomer) {
        // delete all product from a customer
        const deleteAllCustomerProduct = await Product.deleteMany({seller_id: customer._id});

        const deletedCustomer = customer.profil === "seller" ? await UserSeller.findOneAndDelete({_id: customer._id}) : await User.findOneAndDelete({_id: customer._id});

        if (deleteAllCustomerProduct.acknowledged && deletedCustomer) {
            return res.status(200).json({
                message: "Votre profil a bien été supprimer à bientôt sur Liveshopp 👋.",
            });
        } else {
            return res.status(400).json({
                message: "Un probleme est survenu, réessayez plus tard.",
            });
        }
    } else {
        return res.status(400).json({
            message: "Un probleme est survenu, réessayez plus tard.",
        });
    }
});

router.post("/signal-customer", verifyJwt, async (req, res) => {
    const user = await User.findOne({_id: req.user.id});
    const seller = await UserSeller.findOne({_id: req.user.id});

    const customer = user || seller;

    const flagType = req.body.data.flag_type;

    const isMessageFlagType = flagType === 'message';

    const isAlreadyFlagThisByCustomer = await Reported.findOne({
        flagger_id: customer._id,
        flag_user_id: req.body.data.item ? req.body.data.item.userId : req.body.data.liveData.sellerId
    })
    const isAlreadyBanned = await BannedUsers.findOne({
        id: req.body.data.item ? req.body.data.item.userId : req.body.data.liveData.sellerId
    })

    if (isAlreadyFlagThisByCustomer) {
        return res.status(400).json({
            isReported: false,
            message: "Vous avez déjà signaler cet utilisateur",
        });
    }

    if (isAlreadyBanned) {
        return res.status(400).json({
            isReported: false,
            message: "Un signalement est déja en cours pour cet utilisateur",
        });
    }

    const reported = new Reported({
        flagger_id: customer._id,
        flagger_email: customer.email,
        flag_type: flagType,
        flag_user_id: isMessageFlagType ? req.body.data.item.userId : req.body.data.liveData.sellerId,
        flag_user_username: isMessageFlagType ? req.body.data.item.username : req.body.data.liveData.sellerName,
        flag_message: isMessageFlagType ? req.body.data.item.message : "",
        flag_livename: req.body.data.liveData.channelName,
        live_data: req.body.data.liveData
    });

    const newReported = await reported.save();

    if (newReported) {
        return res.status(200).json({
            isReported: true,
            message: 'L\'utilisateur as bien était signalé',
        });
    } else {
        return res.status(400).json({
            isReported: false,
            message: "Un probleme est survenu, réessayez plus tard",
        });
    }
});

router.get("/get-blocked-user", verifyJwt, async (req, res) => {
    const user = await User.findById(req.user.id).populate('blockedUser blockedSeller', '_id company_name profil firstname');
    const seller = await UserSeller.findById(req.user.id).populate('blockedUser blockedSeller', '_id company_name profil firstname');
    const customer = user || seller;

    if (customer) {
        return res.status(200).json({
            blockedUser: customer.blockedUser,
            blockedSeller: customer.blockedSeller
        });
    } else {
        return res.status(400).json({
            isReported: false,
            message: "Un probleme est survenu, réessayez plus tard",
        });
    }
});

router.post("/unblock-user", verifyJwt, async (req, res) => {
    const {_id, profil} = req.body.data;

    const user = await User.findById(req.user.id).populate('blockedUser blockedSeller');
    const seller = await UserSeller.findById(req.user.id).populate('blockedUser blockedSeller');
    const customer = user || seller;

    if (customer) {
        if (profil === "seller") {
            const blocked = customer.blockedSeller.filter(blockedSeller => blockedSeller._id.valueOf() !== _id);
            const updatedCustomer = await updateCustomer(customer, {blockedSeller: blocked}, false);

            if (updatedCustomer) {
                return res.status(200).json({
                    id: _id,
                    profil: "seller",
                    message: "L\'utilisateur à bien était débloqué",
                });
            } else {
                return res.status(400).json({
                    message: "Un probleme est survenu, réessayez plus tard",
                });
            }
        }
        if (profil === "user") {
            const blocked = customer.blockedUser.filter(blockedUser => blockedUser._id.valueOf() !== _id);
            const updatedCustomer = await updateCustomer(customer, {blockedUser: blocked}, false);

            if (updatedCustomer) {
                return res.status(200).json({
                    id: _id,
                    profil: "user",
                    message: "L\'utilisateur à bien était débloqué",
                });
            } else {
                return res.status(400).json({
                    message: "Un probleme est survenu, réessayez plus tard",
                });
            }
        }
    } else {
        return res.status(400).json({
            isReported: false,
            message: "Un probleme est survenu, réessayez plus tard",
        });
    }
});

module.exports = router;
