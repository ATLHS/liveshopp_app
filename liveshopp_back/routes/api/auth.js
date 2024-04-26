const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const randomNumber = require("../../utils/randomDigitNumber.js");
const {verifyJwt} = require("../../middleware/verifyJwt");
const UserSeller = require("../../models/seller");
const User = require("../../models/user");
const saltRounds = 12;
const {updateCustomer} = require("../../utils/updateCustomer.js");
const {sendCodeToConfirmEmailRegistration, sendWelcomeEmail, sendCodeToResetPassword} = require("../../utils/sendCodeConfirmationEmail");
const stripeUtils = require("../../utils/stripeUtils");

router.post("/user-signin", async (req, res) => {
    const {email, password} = req.body.data;
    // 1 check if email exist
    // 2 check is user is confirmed
    // 3 check password
    // 4 create token and send it
    const user = await User.findOne({email}).populate('blockedUser blockedSeller', '_id');
    const seller = await UserSeller.findOne({email}).populate('blockedUser blockedSeller', '_id');

    const customer = user || seller;

    if (customer) {
        if (customer.isConfirmed) {
            bcrypt.compare(password, customer.password).then((result) => {
                if (result) {
                    const payload = {
                        id: customer._id, email: customer.email,
                    };

                    jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN}, (err, token) => {
                        if (err) {
                            return res.status(400).json({
                                message: "Un probleme est survenu, réessayez plus tard.",
                            });
                        }
                        res
                            .status(200)
                            .json({
                                user: {
                                    id: customer._id,
                                    email: customer.email,
                                    profil: customer.profil,
                                    firstname: customer.firstname,
                                    lastname: customer.lastname,
                                    phone: customer.phone || null,
                                    company_name: customer.company_name || null,
                                    role: customer.role || null,
                                    business_activity: customer.business_activity || null,
                                    shipping_address: customer.shipping_address,
                                    hasValidPaymentMethod: customer.hasValidPaymentMethod,
                                    imageUrl: customer.imageUrl,
                                    blockedUser: customer.blockedUser,
                                    blockedSeller: customer.blockedSeller,
                                    isBanned: customer.isBanned,
                                    bio: customer.bio || null,
                                    tiktok: customer.tiktok || null,
                                    instagram: customer.instagram || null,
                                    websiteUrl: customer.websiteUrl || null
                                },
                                token
                            });
                    });
                } else {
                    return res.status(400).json({
                        message: "Adresse e-mail ou mot de passe incorrect.",
                    });
                }
            });
        }
        if (!customer.isConfirmed) {
            return res.status(400).json({
                message: "Votre adresse e-mail doit être confirmée avant de vous connecter.",
            });
        }
    } else {
        return res.status(400).json({
            message: "Aucun utilisateur existe avec cette adresse e-mail.",
        });
    }
});


router.post("/user-signup", async (req, res) => {
    // 1 check if email exist
    // 2 check is user is confirmed
    // 3 check password
    // 4 create token and send it
    const {firstname, lastname, email, phone, password} = req.body.data;
    const registeredConfirmedCode = randomNumber.randomFourDigitNumber();
    const user = await User.findOne({email});
    const seller = await UserSeller.findOne({email});


    // check if email exist in seller db
    if (seller && seller.email === email) return res.status(400).json({
        message: `Un utilisateur avec l'adresse e-mail : ${email} existe déja.`,
    });

    if (user) {
        if (user.isConfirmed) {
            return res.status(400).json({
                message: `Un utilisateur avec l'adresse e-mail : ${user.email} existe déja.`,
            });
        }
        if (!user.isConfirmed) {
            const hashedPassword = await bcrypt.hash(password, saltRounds).then((hash) => hash);
            await User.findOneAndUpdate({_id: user.id}, {registeredConfirmedCode, password: hashedPassword}, {
                new: true,
            }, async (err, updatedUser) => {
                if (err) {
                    return res.status(400).json({
                        message: "Un probleme est survenu, réessayez plus tard.",
                    });
                } else {
                    // send confirmed code to the user via Email
                    // const isSent = sendSMS.sendConfirmationCodeSms(registeredConfirmedCode, formattedPhone(phone));

                    //TO DO check if email is sent to
                    if (updatedUser) {
                        await sendCodeToConfirmEmailRegistration(updatedUser.email, registeredConfirmedCode)
                        return res.status(200).json({
                            user: {
                                id: updatedUser._id, isConfirmed: updatedUser.isConfirmed,
                            }, message: `Entrez le code reçu à l'adresse e-mail : ${updatedUser.email}.`,
                        });
                    } else {
                        return res.status(400).json({
                            message: "Un probleme est survenu, réessayez plus tard.",
                        });
                    }
                }
            }).clone();
        }
    } else {
        const createdCustomer = await stripeUtils.createCustomer({
            firstname,
            email,
            phone
        });
        if (createdCustomer) {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                    const user = new User({
                        firstname,
                        lastname,
                        phone,
                        email,
                        password: hash,
                        isConfirmed: false,
                        registeredConfirmedCode,
                        stripeCustomerId: createdCustomer.id,
                        imageUrl: createdCustomer.imageUrl || null
                    });
                    const newUser = await user.save();

                    if (newUser) {
                        // send email confirmed code to the user
                        await sendCodeToConfirmEmailRegistration(newUser.email, registeredConfirmedCode)
                        return res.status(200).json({
                            user: {
                                id: newUser.id,
                                isConfirmed: newUser.isConfirmed
                            },
                            message: `Entrez le code reçu à l'adresse e-mail : ${newUser.email} :`,
                        });

                    } else {
                        return res.status(400).json({
                            user: {firstname: newUser.firstname},
                            message: "Un probleme est survenu, réessayez plus tard.",
                        });
                    }
                }
            );
        } else {
            return res.status(400).json({
                user: {firstname: newUser.firstname},
                message: "Un probleme est survenu, réessayez plus tard.",
            });
        }
    }
});

router.post("/seller-signup", async (req, res) => {
    const {firstname, lastname, company_name, business_activity, role, phone, email, password} = req.body.data;
    const registeredConfirmedCode = randomNumber.randomFourDigitNumber();
    const seller = await UserSeller.findOne({email});
    const user = await User.findOne({email});

    // check if user already exist with passing email
    if (user && user.email === email) return res.status(400).json({
        message: `Un utilisateur avec l'adresse e-mail : ${email} existe déja.`,
    });

    if (seller) {
        if (seller.isConfirmed) {
            return res.status(400).json({
                message: `Un utilisateur avec l'adresse e-mail : ${seller.email} existe déja.`,
            });
        }
        if (!seller.isConfirmed) {
            const hashedPassword = await bcrypt.hash(password, saltRounds).then((hash) => hash);
            await UserSeller.findOneAndUpdate({_id: seller.id}, {registeredConfirmedCode, password: hashedPassword}, {
                new: true,
            }, async (err, updatedSeller) => {
                if (err) {
                    return res.status(400).json({
                        message: "Un probleme est survenu, réessayez plus tard.",
                    });
                } else {
                    // send confirmed code to the user via Email
                    // const isSent = sendSMS.sendConfirmationCodeSms(registeredConfirmedCode, formattedPhone(phone));

                    //TO DO check if email is sent to
                    if (updatedSeller) {
                        await sendCodeToConfirmEmailRegistration(updatedSeller.email, registeredConfirmedCode)
                        return res.status(200).json({
                            user: {
                                id: updatedSeller._id, isConfirmed: updatedSeller.isConfirmed,
                            }, message: `Entrez le code reçu à l'adresse e-mail : ${updatedSeller.email}.`,
                        });
                    } else {
                        return res.status(400).json({
                            message: "Un probleme est survenu, réessayez plus tard.",
                        });
                    }
                }
            }).clone();
        }
    } else {
        const createdCustomer = await stripeUtils.createCustomer({
            company_name,
            email,
            phone,
        });
        if (createdCustomer) {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                    const seller = new UserSeller({
                        firstname,
                        lastname,
                        role,
                        phone,
                        email,
                        company_name,
                        business_activity,
                        password: hash,
                        registeredConfirmedCode,
                        stripeCustomerId: createdCustomer.id,
                        imageUrl: createdCustomer.imageUrl || null
                    });
                    const newSeller = await seller.save();

                    if (newSeller) {
                        // send email confirmed code to the user
                        await sendCodeToConfirmEmailRegistration(newSeller.email, registeredConfirmedCode)
                        return res.status(200).json({
                            user: {
                                id: newSeller.id,
                                isConfirmed: newSeller.isConfirmed
                            },
                            message: `Entrez le code reçu à l'adresse e-mail : ${newSeller.email} :`,
                        });

                    } else {
                        return res.status(400).json({
                            user: {firstname: newSeller.firstname},
                            message: "Un probleme est survenu, réessayez plus tard.",
                        });
                    }
                }
            );
        } else {
            return res.status(400).json({
                user: {firstname: newSeller.firstname},
                message: "Un probleme est survenu, réessayez plus tard.",
            });
        }
    }
});

router.post("/reset-password", async (req, res) => {
    const {email} = req.body.data;
    const user = await User.findOne({email});
    const seller = await UserSeller.findOne({email});

    const customer = user || seller;

    if (customer && customer.isConfirmed) {
        const registeredConfirmedCode = randomNumber.randomFourDigitNumber();
        const updatedCustomer = await updateCustomer(customer, {resetPasswordCode: registeredConfirmedCode}, false);

        if (updatedCustomer) {
            await sendCodeToResetPassword(updatedCustomer.email, registeredConfirmedCode)
            return res.status(200).json({
                user: {
                    id: updatedCustomer._id,
                }, message: `Entrez le code de vérification reçu à l'adresse e-mail : ${updatedCustomer.email}.`,
            });
        } else {
            return res.status(400).json({
                message: "Un probleme est survenu, réessayez plus tard.",
            });
        }
    } else {
        return res.status(400).json({
            message: "Aucun utilisateur existe avec cette adresse e-mail.",
        });
    }
});

router.post("/check-reset-password-code", async (req, res) => {
    const {
        code,
        id,
    } = req.body.data;
    const user = await User.findOne({_id: id});
    const seller = await UserSeller.findOne({_id: id});

    const customer = user || seller;

    if (code && customer) {
        const isValidCode = customer.resetPasswordCode === Number(code);
        if (isValidCode) {
            return res.status(200).json({
                user: {
                    id: customer._id,
                },
            });
        } else {
            return res.status(400).json({
                message: "Code incorrect veuillez réessayer.",
            });
        }
    } else {
        return res.status(400).json({
            message: "Un probleme est survenu, réessayez plus tard.",
        });
    }
});

router.post("/reset-customer-password", async (req, res) => {
    const {
        password_1,
        id,
    } = req.body.data;
    const user = await User.findOne({_id: id});
    const seller = await UserSeller.findOne({_id: id});

    const customer = user || seller;

    if (password_1 && customer) {
        const hash = bcrypt.hashSync(password_1, saltRounds);

        const updatedCustomer = await updateCustomer(customer, {password: hash}, false);

        if (updatedCustomer) {
            /*await sendResetPasswordConfirmation(updatedCustomer.email, registeredConfirmedCode);*/
            return res.status(200).json({
                message: "Votre mot de passe a été réinitialisé avec succès 🎉",
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

router.post("/confirm-user-email", async (req, res) => {
    const {
        code,
        id,
    } = req.body.data;
    const user = await User.findOne({_id: id});
    const seller = await UserSeller.findOne({_id: id});

    const customer = user || seller;

    if (code && customer) {
        const isValidCode = customer.registeredConfirmedCode === Number(code);
        if (isValidCode) {
            const updatedCustomer = await updateCustomer(customer, {isConfirmed: true}, false);
            if (updatedCustomer) {
                const payload = {
                    id: updatedCustomer._id, email: updatedCustomer.email,
                };

                jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN}, (err, token) => {
                    if (err) {
                        return res.status(400).json({
                            message: "Un probleme est survenu, réessayez plus tard.",
                        });
                    }

                    sendWelcomeEmail(customer);

                    return res
                        .status(200)
                        .json({
                            user: {
                                id: customer._id,
                                email: customer.email,
                                profil: customer.profil,
                                firstname: customer.firstname,
                                lastname: customer.lastname,
                                phone: customer.phone || null,
                                company_name: customer.company_name || null,
                                role: customer.role || null,
                                business_activity: customer.business_activity || null,
                                shipping_address: customer.shipping_address,
                                hasValidPaymentMethod: customer.hasValidPaymentMethod,
                                imageUrl: customer.imageUrl || null,
                                blockedUser: customer.blockedUser,
                                blockedSeller: customer.blockedSeller,
                                bio: customer.bio || null,
                                tiktok: customer.tiktok || null,
                                instagram: customer.instagram || null,
                                websiteUrl: customer.websiteUrl || null
                            },
                            token
                        });
                });
            }
        } else {
            return res.status(400).json({
                user: {id: customer._id, isConfirmed: customer.isConfirmed},
                message: "Code incorrect veuillez réessayer.",
            });
        }

    } else {
        return res.status(400).json({
            user: {id: customer._id, isConfirmed: customer.isConfirmed},
            message: "Un probleme est survenu, réessayez plus tard.",
        });
    }
});

router.get("/is-authenticate", verifyJwt, async (req, res) => {
    const user = await User.findOne({_id: req.user.id}).populate('blockedUser blockedSeller', '_id');
    const seller = await UserSeller.findOne({_id: req.user.id}).populate('blockedUser blockedSeller', '_id');

    const customer = user || seller;

    if (customer) {
        return res
            .status(200)
            .json({
                user: {
                    id: customer._id,
                    email: customer.email,
                    profil: customer.profil,
                    firstname: customer.firstname,
                    lastname: customer.lastname,
                    phone: customer.phone || null,
                    company_name: customer.company_name || null,
                    role: customer.role || null,
                    business_activity: customer.business_activity || null,
                    shipping_address: customer.shipping_address,
                    hasValidPaymentMethod: customer.hasValidPaymentMethod,
                    imageUrl: customer.imageUrl || null,
                    blockedUser: customer.blockedUser,
                    blockedSeller: customer.blockedSeller,
                    bio: customer.bio || null,
                    tiktok: customer.tiktok || null,
                    instagram: customer.instagram || null,
                    websiteUrl: customer.websiteUrl || null
                },
                isAuthenticate: true,
            });
    } else {
        return res.status(400).json({
            message: "Un probleme est survenu, réessayez plus tard.",
        });
    }
});

module.exports = router;
