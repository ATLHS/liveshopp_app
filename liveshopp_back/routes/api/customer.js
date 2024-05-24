const router = require('express').Router();
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const Sentry = require('@sentry/node');
const { log } = require('../../middleware/logger');
const { s3 } = require('../../utils/services');
const { verifyJwt } = require('../../middleware/verifyJwt');
const UserSeller = require('../../models/seller');
const User = require('../../models/user');
const Live = require('../../models/live');
const Product = require('../../models/product');
const Reported = require('../../models/reported');
const { updateCustomer } = require('../../utils/updateCustomer.js');
const stripeUtils = require('../../utils/stripeUtils');
const BannedUsers = require('../../models/banned');
const VideosItem = require('../../models/auction_videos_items');

router.post('/update-customer-profil', verifyJwt, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('blockedUser blockedSeller', '_id');
    const seller = await UserSeller.findById(req.user.id).populate('blockedUser blockedSeller', '_id');
    const body = req.body.data;
    const customer = user || seller;
    const data =
      customer.profil === 'user'
        ? {
            firstname: body.firstname,
            lastname: body.lastname,
            email: body.email,
            phone: body.phone,
          }
        : {
            firstname: body.firstname,
            lastname: body.lastname,
            email: body.email,
            phone: body.phone,
            bio: body.bio,
            tiktok: body.tiktok,
            instagram: body.instagram,
            websiteUrl: body.websiteUrl,
          };

    if (customer) {
      const updatedCustomer = await updateCustomer(customer, data, false);
      if (updatedCustomer) {
        return res.status(200).json({
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
            blockedSeller: customer.blockedSeller,
            bio: customer.bio || null,
            tiktok: customer.tiktok || null,
            instagram: customer.instagram || null,
            websiteUrl: customer.websiteUrl || null,
          },
          message: 'Votre profil a été modifié avec succès.',
        });
      }
    }

    return res.status(400).json({ message: 'Un problème est survenu, réessayez plus tard.' });
  } catch (error) {
    Sentry.captureException(error);
    return res.sendStatus(500);
  }
});

router.post('/update-user-shipping-address', verifyJwt, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('blockedUser blockedSeller', '_id');
    const seller = await UserSeller.findById(req.user.id).populate('blockedUser blockedSeller', '_id');
    const customer = user || seller;

    if (customer) {
      const updatedCustomer = await updateCustomer(customer, req.body.data, false);
      if (updatedCustomer) {
        return res.status(200).json({
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
            blockedSeller: customer.blockedSeller,
            bio: customer.bio || null,
            tiktok: customer.tiktok || null,
            instagram: customer.instagram || null,
            websiteUrl: customer.websiteUrl || null,
          },
          message: 'Votre adresse de livraison a été modifiée avec succès.',
        });
      }
    }

    return res.status(400).json({ message: 'Un problème est survenu, réessayez plus tard.' });
  } catch (error) {
    Sentry.captureException(error);
    return res.sendStatus(500);
  }
});

router.post('/update-user-payment-method-status', verifyJwt, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id }).populate('blockedUser blockedSeller', '_id');
    const seller = await UserSeller.findOne({ _id: req.user.id }).populate('blockedUser blockedSeller', '_id');
    const customer = user || seller;

    if (customer) {
      const updatedCustomer = await updateCustomer(customer, { hasValidPaymentMethod: true }, false);
      if (updatedCustomer) {
        return res.status(200).json({
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
            hasValidPaymentMethod: updatedCustomer.hasValidPaymentMethod,
            imageUrl: customer.imageUrl || null,
            blockedUser: customer.blockedUser,
            blockedSeller: customer.blockedSeller,
            bio: customer.bio || null,
            tiktok: customer.tiktok || null,
            instagram: customer.instagram || null,
            websiteUrl: customer.websiteUrl || null,
          },
          message: 'Votre moyen de paiement a été configuré avec succès.',
        });
      }
    }

    return res.status(400).json({
      message: 'Un probleme est survenu, réessayez plus tard.',
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.sendStatus(500);
  }
});

router.post('/get-customer', verifyJwt, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const seller = await UserSeller.findById(req.user.id);
    const customer = user || seller;

    if (customer) {
      return res.status(200).json({ customer });
    }

    return res.status(400).json({ message: 'Un problème est survenu, réessayez plus tard.' });
  } catch (error) {
    Sentry.captureException(error);
    return res.sendStatus(500);
  }
});

router.post('/set-profil-picture', verifyJwt, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const seller = await UserSeller.findById(req.user.id);
    const customer = user || seller;

    const body = req.body.data;
    const buffer = Buffer.from(body.base64, 'base64');

    if (customer) {
      // Upload image to S3 bucket
      const uploadResponse = await s3.send(
        new PutObjectCommand({
          Body: buffer,
          Bucket: 'profil-picture',
          Key: 'picture/' + customer._id,
          ContentType: body.type,
        }),
      );

      if (uploadResponse.$metadata.httpStatusCode === 200) {
        const imageUrl = `https://profil-picture.s3.${process.env.AWS_REGION}.amazonaws.com/picture/${customer._id}`;
        const customerModel = customer.profil === 'seller' ? UserSeller : User;

        const updatedCustomer = await customerModel.findOneAndUpdate(
          { _id: customer._id },
          { imageUrl: imageUrl },
          { new: true },
        );

        const isSeller = customer.profil === 'seller';

        if (isSeller) {
          await Live.updateMany({ seller_id: customer._id }, { imageUrl });
        }

        return res.status(200).json({
          user: {
            id: updatedCustomer._id,
            email: updatedCustomer.email,
            profil: updatedCustomer.profil,
            firstname: updatedCustomer.firstname,
            lastname: updatedCustomer.lastname,
            phone: updatedCustomer.phone || null,
            shipping_address: updatedCustomer.shipping_address,
            company_name: updatedCustomer.company_name || null,
            role: updatedCustomer.role || null,
            business_activity: updatedCustomer.business_activity || null,
            hasValidPaymentMethod: updatedCustomer.hasValidPaymentMethod,
            imageUrl: updatedCustomer.imageUrl,
            blockedUser: updatedCustomer.blockedUser,
            blockedSeller: updatedCustomer.blockedSeller,
            bio: updatedCustomer.bio || null,
            tiktok: updatedCustomer.tiktok || null,
            instagram: updatedCustomer.instagram || null,
            websiteUrl: updatedCustomer.websiteUrl || null,
          },
          message: 'Votre photo de profil a été modifiée avec succès.',
        });
      } else {
        return res.status(500).json({ message: "Une erreur s'est produite lors de l'envoi de l'image." });
      }
    }

    return res.status(400).json({ message: 'Un problème est survenu, réessayez plus tard.' });
  } catch (error) {
    Sentry.captureException(error);
    return res.sendStatus(500);
  }
});

router.delete('/delete-profil-picture', verifyJwt, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const seller = await UserSeller.findById(req.user.id);
    const customer = user || seller;

    const isSeller = customer.profil === 'seller';

    // delete profil pictures from all frames
    if (isSeller) {
      let lives = await Live.find({ seller_id: customer._id });

      if (lives.length) {
        for (const live of lives) {
          live.imageUrl = '';
          await live.save();
        }
      }
    }

    if (customer) {
      const uploadResponse = await s3.send(
        new DeleteObjectCommand({
          Bucket: 'profil-picture',
          Key: 'picture/' + customer._id,
        }),
      );

      if (uploadResponse.$metadata.httpStatusCode === 204) {
        customer.imageUrl = '';
        await customer.save();

        return res.status(200).json({
          user: {
            id: customer._id,
            email: customer.email,
            profil: customer.profil,
            firstname: customer.firstname,
            lastname: customer.lastname,
            phone: customer.phone || null,
            shipping_address: customer.shipping_address,
            company_name: customer.company_name || null,
            role: customer.role || null,
            business_activity: customer.business_activity || null,
            hasValidPaymentMethod: customer.hasValidPaymentMethod,
            imageUrl: customer.imageUrl,
            blockedUser: customer.blockedUser,
            blockedSeller: customer.blockedSeller,
            bio: customer.bio || null,
            tiktok: customer.tiktok || null,
            instagram: customer.instagram || null,
            websiteUrl: customer.websiteUrl || null,
          },
          message: 'Votre photo de profil a été supprimée avec succès.',
        });
      } else {
        return res.status(500).json({ message: "Une erreur s'est produite lors de l'envoi de l'image." });
      }
    }

    return res.status(400).json({ message: 'Un problème est survenu, réessayez plus tard.' });
  } catch (error) {
    Sentry.captureException(error);
    return res.sendStatus(500);
  }
});

router.post('/delete-customer', verifyJwt, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const seller = await UserSeller.findById(req.user.id);
    const customer = user || seller;

    // delete all lives from the current sellers profile
    if (customer.profil === 'seller') {
      // check if the seller has any unshipped products
      const product = await Product.findOne({ seller_id: customer._id, deliveryStatut: "En attente d'expédition" });
      if (product) {
        return res.status(400).json({
          message: "Votre compte ne peut pas être supprimé, des commandes sont toujours en attente d'expédition.",
        });
      }
      const deleteAllSellerLive = await Live.deleteMany({ seller_id: customer._id });
      if (!deleteAllSellerLive.acknowledged) {
        return res.status(400).json({ message: 'Un problème est survenu, réessayez plus tard.' });
      }
    }

    // delete stripe customer
    const deletedCustomer = await stripeUtils.deleteCustomer(customer.stripeCustomerId);

    if (deletedCustomer) {
      // delete all product from a customer
      const deleteAllCustomerProduct = await Product.deleteMany({ seller_id: customer._id });

      const deletedCustomer =
        customer.profil === 'seller'
          ? await UserSeller.findByIdAndDelete(customer._id)
          : await User.findByIdAndDelete(customer._id);

      if (deleteAllCustomerProduct.acknowledged && deletedCustomer) {
        return res.status(200).json({ message: 'Votre profil a bien été supprimé, à bientôt sur Liveshopp 👋.' });
      }
    }

    return res.status(400).json({ message: 'Un problème est survenu, réessayez plus tard.' });
  } catch (error) {
    Sentry.captureException(error);
    return res.sendStatus(500);
  }
});

router.post('/signal-customer', verifyJwt, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const seller = await UserSeller.findById(req.user.id);
    const customer = user || seller;

    const flagType = req.body.data.flag_type;
    const isMessageFlagType = flagType === 'message';

    const isAlreadyFlagThisByCustomer = await Reported.findOne({
      flagger_id: customer._id,
      flag_user_id: req.body.data.item ? req.body.data.item.userId : req.body.data.liveData.sellerId,
    });
    const isAlreadyBanned = await BannedUsers.findOne({
      id: req.body.data.item ? req.body.data.item.userId : req.body.data.liveData.sellerId,
    });
    if (isAlreadyFlagThisByCustomer) {
      return res.status(400).json({
        isReported: false,
        message: 'Vous avez déjà signalé cet utilisateur',
      });
    }

    if (isAlreadyBanned) {
      return res.status(400).json({
        isReported: false,
        message: 'Un signalement est déja en cours pour cet utilisateur',
      });
    }

    const reported = new Reported({
      flagger_id: customer._id,
      flagger_email: customer.email,
      flag_type: flagType,
      flag_user_id: isMessageFlagType ? req.body.data.item.userId : req.body.data.liveData.sellerId,
      flag_user_username: isMessageFlagType ? req.body.data.item.username : req.body.data.liveData.sellerName,
      flag_message: isMessageFlagType ? req.body.data.item.message : '',
      flag_livename: req.body.data.liveData.channelName,
      live_data: req.body.data.liveData,
    });

    const newReported = await reported.save();

    if (newReported) {
      return res.status(200).json({
        isReported: true,
        message: "L'utilisateur a bien été signalé",
      });
    }

    return res.status(400).json({
      isReported: false,
      message: 'Un problème est survenu, réessayez plus tard',
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.sendStatus(500);
  }
});

router.get('/get-blocked-user', verifyJwt, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      'blockedUser blockedSeller',
      '_id company_name profil firstname',
    );
    const seller = await UserSeller.findById(req.user.id).populate(
      'blockedUser blockedSeller',
      '_id company_name profil firstname',
    );
    const customer = user || seller;

    if (customer) {
      return res.status(200).json({
        blockedUser: customer.blockedUser,
        blockedSeller: customer.blockedSeller,
      });
    }

    return res.status(400).json({
      isReported: false,
      message: 'Un problème est survenu, réessayez plus tard',
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.sendStatus(500);
  }
});

router.post('/signal-auction-video', verifyJwt, async (req, res) => {
  try {
    const body = req.body.data;

    const isAlreadyReported = await VideosItem.findOne({
      _id: body.item._id,
      isReportedForModeration: true,
    });

    if (isAlreadyReported) {
      return res.status(400).json({
        message: 'Un signalement est déjà en cours pour cette enchère vidéo.',
      });
    }

    const reportedAuctionVideo = await VideosItem.findOneAndUpdate(
      { _id: body.item._id },
      { isReportedForModeration: true },
      { new: true },
    );

    if (reportedAuctionVideo) {
      return res.status(200).json({
        isReported: true,
        message: "L'enchère vidéo a bien été signalée.",
      });
    }

    return res.status(400).json({
      isReported: false,
      message: 'Un problème est survenu, réessayez plus tard',
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.sendStatus(500);
  }
});

router.get('/get-sellers', verifyJwt, async (req, res) => {
  try {
    const sellers = await UserSeller.find();

    if (sellers) {
      return res.status(200).json(sellers);
    }

    return res.status(400).json({ message: 'Un problème est survenu, réessayez plus tard' });
  } catch (error) {
    Sentry.captureException(error);
    return res.sendStatus(500);
  }
});

router.post('/block', verifyJwt, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const seller = await UserSeller.findById(req.user.id);
    const body = req.body.data;
    const customer = user || seller;

    const customerToBlock =
      body.profil === 'seller' ? { blockedSeller: body.item.seller_id } : { blockedUser: body.item.userId };

    // check if the customer to block is already blocked
    const isAlreadyBlocked = customer.blockedUser
      .concat(customer.blockedSeller)
      .includes(body.item.seller_id || body.item.userId);

    if (isAlreadyBlocked) {
      return;
    }
    const updatedCustomer = await updateCustomer(customer, customerToBlock, true);

    if (updatedCustomer) {
      return res.status(200).json({
        user: {
          id: updatedCustomer._id,
          email: updatedCustomer.email,
          profil: updatedCustomer.profil,
          firstname: updatedCustomer.firstname,
          lastname: updatedCustomer.lastname,
          phone: updatedCustomer.phone || null,
          shipping_address: updatedCustomer.shipping_address,
          company_name: updatedCustomer.company_name || null,
          role: updatedCustomer.role || null,
          business_activity: updatedCustomer.business_activity || null,
          hasValidPaymentMethod: updatedCustomer.hasValidPaymentMethod,
          imageUrl: updatedCustomer.imageUrl,
          blockedUser: updatedCustomer.blockedUser,
          blockedSeller: updatedCustomer.blockedSeller,
          bio: updatedCustomer.bio || null,
          tiktok: updatedCustomer.tiktok || null,
          instagram: updatedCustomer.instagram || null,
          websiteUrl: updatedCustomer.websiteUrl || null,
        },
        message: `L\'utilisateur ${body.item.sellerName} a bien été bloqué`,
      });
    }

    return res.status(400).json({ message: 'Un problème est survenu, réessayez plus tard' });
  } catch (error) {
    Sentry.captureException(error);
    return res.sendStatus(500);
  }
});

router.post('/unblock-user', verifyJwt, async (req, res) => {
  try {
    const { _id, profil } = req.body.data;

    const user = await User.findById(req.user.id).populate('blockedUser blockedSeller');
    const seller = await UserSeller.findById(req.user.id).populate('blockedUser blockedSeller');
    const customer = user || seller;

    if (customer) {
      if (profil === 'seller') {
        const blocked = customer.blockedSeller.filter((blockedSeller) => blockedSeller._id.valueOf() !== _id);
        const updatedCustomer = await updateCustomer(customer, { blockedSeller: blocked }, false);

        if (updatedCustomer) {
          return res.status(200).json({
            id: _id,
            profil: 'seller',
            message: "L'utilisateur a bien été débloqué",
            updatedCustomer,
          });
        }
      }

      if (profil === 'user') {
        const blocked = customer.blockedUser.filter((blockedUser) => blockedUser._id.valueOf() !== _id);
        const updatedCustomer = await updateCustomer(customer, { blockedUser: blocked }, false);

        if (updatedCustomer) {
          return res.status(200).json({
            id: _id,
            profil: 'user',
            message: "L'utilisateur a bien été débloqué",
            updatedCustomer,
          });
        }
      }
    }

    return res.status(400).json({
      isReported: false,
      message: 'Un problème est survenu, réessayez plus tard',
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.sendStatus(500);
  }
});

module.exports = router;
