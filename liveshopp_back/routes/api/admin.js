const router = require('express').Router();
const Sentry = require('@sentry/node');
const { verifyJwt } = require('../../middleware/verifyJwt');
const BannedUsers = require('../../models/banned');
const Reported = require('../../models/reported');
const UserSeller = require('../../models/seller');
const User = require('../../models/user');
const { updateCustomer } = require('../../utils/updateCustomer');

router.get('/get-banned-users', verifyJwt, async (req, res) => {
  try {
    const bannedUsers = await BannedUsers.find().exec();
    return res.status(200).json({ bannedUsers });
  } catch (error) {
    Sentry.captureException(error);
    return res.sendStatus(500);
  }
});

router.post('/unban-user', verifyJwt, async (req, res) => {
  try {
    const { id } = req.body.data;
    const user = await User.findById(id).exec();
    const seller = await UserSeller.findById(id).exec();
    const customer = user || seller;

    if (customer) {
      const updatedCustomer = await updateCustomer(customer, { isBanned: false }, false);
      if (updatedCustomer) {
        const bannedUser = await BannedUsers.findOneAndDelete({ id: id }).exec();
        const bannedUsers = await BannedUsers.find().exec();

        if (bannedUser) {
          return res.status(200).json({
            message: `L'utilisateur ${customer.company_name || customer.firstname} n'est plus banni`,
            bannedUsers,
          });
        }
      }
    }

    return res.status(400).json({ message: 'Oops ! Un probleme est survenu, réessayez plus tard...' });
  } catch (error) {
    Sentry.captureException(error);
    return res.sendStatus(500);
  }
});

router.post('/ban-user', verifyJwt, async (req, res) => {
  try {
    // get the id to ban
    let id;
    if (req.body.data.sellerId) {
      id = req.body.data.sellerId;
      await Reported.findOneAndUpdate({ flag_user_id: req.body.data.flag_user_id }, { isBlocked: true }).exec();
    }
    if (req.body.data.item) {
      id = req.body.data.item.userId;
      await Reported.findOneAndUpdate({ flag_user_id: req.body.data.flag_user_id }, { isBlocked: true }).exec();
    }
    if (req.body.data.flag_user_id) {
      id = req.body.data.flag_user_id;
      await Reported.findOneAndUpdate({ flag_user_id: req.body.data.flag_user_id }, { isBlocked: true }).exec();
    }

    const liveData = req.body.data || req.body.data.liveData;
    const user = await User.findById(id).exec();
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
        const updatedCustomer = await updateCustomer(customer, { isBanned: true }, false);
        if (updatedCustomer) {
          io.emit('banUser', { updatedCustomer, liveData });
          return res.status(200).json({
            message: `L'utilisateur ${customer.company_name || customer.firstname} a bien été banni`,
          });
        }
      }
    }

    return res.status(400).json({ message: 'Un problème est survenu, réessayez plus tard.' });
  } catch (error) {
    Sentry.captureException(error);
    return res.sendStatus(500);
  }
});

router.get('/get-flagged-user', verifyJwt, async (req, res) => {
  try {
    const flaggedUsers = await Reported.find({ isBlocked: false }).exec();

    return res.status(200).json({
      flaggedUsers,
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.sendStatus(500);
  }
});

module.exports = router;
