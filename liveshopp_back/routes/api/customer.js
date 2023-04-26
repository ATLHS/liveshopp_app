const router = require("express").Router();
const {verifyJwt} = require("../../middleware/verifyJwt");
const UserSeller = require("../../models/seller");
const User = require("../../models/user");
const Live = require("../../models/live");
const Product = require("../../models/product");
const {updateCustomer} = require("../../utils/updateCustomer.js");
const stripeUtils = require("../../utils/stripeUtils");

router.post("/update-customer-profil", verifyJwt, async (req, res) => {
    const user = await User.findById(req.user.id);
    const seller = await UserSeller.findById(req.user.id);
    const body = req.body.data;

    const customer = user || seller;
    const data = customer.profil === 'user' ? {
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email
    } : {firstname: body.firstname, lastname: body.lastname, phone: body.phone, email: body.email};

    if (customer) {
        const updatedCustomer = await updateCustomer(customer, data);
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
                        imageUrl: customer.imageUrl || null
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
    const user = await User.findOne({_id: req.user.id});
    const seller = await UserSeller.findOne({_id: req.user.id});

    const customer = user || seller;

    if (customer) {
        const updatedCustomer = await updateCustomer(customer, req.body.data);
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
                        imageUrl: customer.imageUrl || null
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
    const user = await User.findOne({_id: req.user.id});
    const seller = await UserSeller.findOne({_id: req.user.id});

    const customer = user || seller;

    if (customer) {
        const updatedCustomer = await updateCustomer(customer, {hasValidPaymentMethod: true});
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
                        imageUrl: customer.imageUrl || null
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

module.exports = router;
