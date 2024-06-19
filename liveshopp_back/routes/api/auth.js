const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Sentry = require('@sentry/node');

const { verifyJwt } = require('../../middleware/verifyJwt');
const UserSeller = require('../../models/seller');
const User = require('../../models/user');
const { updateCustomer } = require('../../utils/updateCustomer.js');
const { randomFourDigitNumber } = require('../../utils/helpers.js');
const {
  sendCodeToConfirmEmailRegistration,
  sendWelcomeEmail,
  sendCodeToResetPassword,
} = require('../../utils/emails.js');
const stripeUtils = require('../../utils/stripeUtils');

const saltRounds = 12;

/**
 * 1 check if email exist
 * 2 check is user is confirmed
 * 3 check password
 * 4 create token and send it
 */
router.post('/user-signin', async (req, res) => {
  try {
    const { email, password } = req.body.data;
    const user = await User.findOne({ email }).populate('blockedUser blockedSeller', '_id');
    const seller = await UserSeller.findOne({ email }).populate('blockedUser blockedSeller', '_id');
    const customer = user || seller;

    if (!customer) {
      return res.status(400).json({ message: req.t('noUserWithEmail') });
    }

    if (!customer.isConfirmed) {
      return res.status(400).json({ message: req.t('emailMustBeConfirmed') });
    }

    const success = await bcrypt.compare(password, customer.password);

    if (!success) {
      return res.status(401).json({ message: req.t('incorrectEmailOrPassword') });
    }

    const payload = {
      id: customer._id,
      email: customer.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    return res.status(200).json({
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
        websiteUrl: customer.websiteUrl || null,
      },
      token,
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
});

// FIXME
// email should be lowered cased
//
/**
 * 1 check if email exist
 * 2 check is user is confirmed
 * 3 check password
 * 4 create token and send it
 */
router.post('/user-signup', async (req, res) => {
  try {
    const { firstname, lastname, email, phone, password } = req.body.data;
    const registeredConfirmedCode = randomFourDigitNumber();
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const seller = await UserSeller.findOne({ email }).exec();
    let user = await User.findOne({ email }).exec();

    // check if email exist in seller db
    if ((seller && seller.email === email) || (user && user.isConfirmed)) {
      return res.status(409).json({ message: req.t('userWithEmailExists', { email }) });
    }

    // User already exists but hasn't confirmed their code yet
    if (user) {
      user = await User.findOneAndUpdate(
        { _id: user.id },
        { registeredConfirmedCode, password: hashedPassword },
        { new: true },
      ).exec();
    } else {
      const stripeCustomer = await stripeUtils.createCustomer({ firstname, email, phone });

      const customer = new User({
        firstname,
        lastname,
        phone,
        email,
        password: hashedPassword,
        isConfirmed: false,
        registeredConfirmedCode,
        stripeCustomerId: stripeCustomer.id,
        imageUrl: stripeCustomer.imageUrl || null,
      });

      user = await customer.save();
    }

    // send email confirmed code to the user
    await sendCodeToConfirmEmailRegistration(user.email, registeredConfirmedCode);

    return res.status(200).json({
      user: {
        id: user.id,
        isConfirmed: user.isConfirmed,
      },
      message: `${req.t('enterCodeEmail')} : ${user.email}`,
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
});

// FIXME
// email should be lowered cased
//
router.post('/seller-signup', async (req, res) => {
  try {
    const { firstname, lastname, company_name, business_activity, role, phone, email, password } = req.body.data;
    const registeredConfirmedCode = randomFourDigitNumber();
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.findOne({ email }).exec();
    let seller = await UserSeller.findOne({ email }).exec();

    // check if user already exist with passing email
    if ((user && user.email === email) || (seller && seller.isConfirmed)) {
      return res.status(409).json({ message: req.t('userWithEmailExists', { email }) });
    }

    // Seller already exists but hasn't confirmed their code yet
    if (seller) {
      seller = await UserSeller.findOneAndUpdate(
        { _id: seller.id },
        { registeredConfirmedCode, password: hashedPassword },
        { new: true },
      ).exec();
    } else {
      const stripeCustomer = await stripeUtils.createCustomer({ company_name, email, phone });

      const cusomter = new UserSeller({
        firstname,
        lastname,
        role,
        phone,
        email,
        company_name,
        business_activity,
        password: hashedPassword,
        registeredConfirmedCode,
        stripeCustomerId: stripeCustomer.id,
        imageUrl: stripeCustomer.imageUrl || null,
      });

      seller = await cusomter.save();
    }

    // send email confirmed code to the user
    await sendCodeToConfirmEmailRegistration(seller.email, registeredConfirmedCode);

    return res.status(200).json({
      user: {
        id: seller.id,
        isConfirmed: seller.isConfirmed,
      },
      message: req.t('enterCodeReceivedAtEmail', { email: seller.email }),
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body.data;
    const user = await User.findOne({ email }).exec();
    const seller = await UserSeller.findOne({ email }).exec();
    const customer = user || seller;

    if (!(customer && customer.isConfirmed)) {
      return res.status(400).json({ message: req.t('noUserWithEmail') });
    }

    const registeredConfirmedCode = randomFourDigitNumber();
    const updatedCustomer = await updateCustomer(customer, { resetPasswordCode: registeredConfirmedCode }, false);

    await sendCodeToResetPassword(updatedCustomer.email, registeredConfirmedCode);

    return res.status(200).json({
      user: {
        id: updatedCustomer._id,
      },
      message: req.t('enterVerificationCodeReceivedAtEmail', { email: updatedCustomer.email }),
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
});

router.post('/check-reset-password-code', async (req, res) => {
  try {
    const { code, id } = req.body.data;
    const user = await User.findById(id).exec();
    const seller = await UserSeller.findById(id).exec();
    const customer = user || seller;
    const isValidCode = customer.resetPasswordCode === Number(code);

    if (!isValidCode) {
      return res.status(400).json({ message: req.t('incorrectCodeTryAgain') });
    }

    return res.status(200).json({ user: { id: customer._id } });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
});

router.post('/reset-customer-password', async (req, res) => {
  try {
    const { password_1, id } = req.body.data;
    const user = await User.findById(id).exec();
    const seller = await UserSeller.findById(id).exec();
    const customer = user || seller;

    if (password_1 && customer) {
      const hashedPassword = await bcrypt.hash(password_1, saltRounds);
      await updateCustomer(customer, { password: hashedPassword }, false);

      /*await sendResetPasswordConfirmation(updatedCustomer.email, registeredConfirmedCode);*/
      return res.status(200).json({ message: req.t('passwordResetSuccessfully') });
    }
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
});

router.post('/confirm-user-email', async (req, res) => {
  try {
    const { code, id } = req.body.data;
    const user = await User.findById(id).exec();
    const seller = await UserSeller.findById(id).exec();
    const customer = user || seller;

    if (code && customer) {
      const isValidCode = customer.registeredConfirmedCode === Number(code);

      if (!isValidCode) {
        return res.status(400).json({
          user: { id: customer._id, isConfirmed: customer.isConfirmed },
          message: req.t('incorrectCodeTryAgain'),
        });
      }

      const updatedCustomer = await updateCustomer(customer, { isConfirmed: true }, false);

      const payload = {
        id: updatedCustomer._id,
        email: updatedCustomer.email,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

      sendWelcomeEmail(customer);

      return res.status(200).json({
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
          websiteUrl: customer.websiteUrl || null,
        },
        token,
      });
    }
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
});

router.get('/is-authenticate', verifyJwt, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('blockedUser blockedSeller', '_id');
    const seller = await UserSeller.findById(req.user.id).populate('blockedUser blockedSeller', '_id');
    const customer = user || seller;

    // FIXME
    //
    // Not sure this is used
    //
    if (customer.blockedSeller.length) {
      for (let blocked of customer.blockedSeller) {
        blocked._id.valueOf();
      }
    }
    if (customer.blockedUser.length) {
      for (let blocked of customer.blockedUser) {
        blocked._id.valueOf();
      }
    }

    return res.status(200).json({
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
        websiteUrl: customer.websiteUrl || null,
      },
      isAuthenticate: true,
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
});

module.exports = router;
