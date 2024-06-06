const router = require('express').Router();
const generateUniqueId = require('generate-unique-id');
const { DateTime, Interval } = require('luxon');
const Sentry = require('@sentry/node');
const { verifyJwt } = require('../../middleware/verifyJwt');
const { generateAgoraChannelToken } = require('../../utils/generateAgoraToken');
const UserSeller = require('../../models/seller');
const Live = require('../../models/live');
const User = require('../../models/user');
const Product = require('../../models/product');

// FIXME
//
// We must change this function.
// Here we are basically updating the next live
// Which can be trigger by anyone, modifying the live of who knows who
// Dangerous and not stable
//
const updateLiveStatus = async () => {
  return await Live.findOneAndUpdate(
    {
      live_date_time: {
        $gte: DateTime.now(),
        $lte: DateTime.now().plus({ minutes: 30 }),
      },
      live_status: 'coming_soon',
    },
    {
      live_status: 'live',
    },
  );
};

router.post('/create-live', verifyJwt, async (req, res) => {
  try {
    const { live_name, live_description, live_date_time } = req.body.data;
    const seller = await UserSeller.findById(req.user.id);
    const nextLive = DateTime.fromJSDate(new Date(live_date_time)).toISO();

    const getAllLowestlives = await Live.find({
      seller_id: req.user.id,
      live_date_time: { $lte: live_date_time },
    }).exec();

    const liveIsOverlapping = getAllLowestlives
      .map((live) =>
        Interval.fromDateTimes(
          DateTime.fromISO(live.live_date_time),
          DateTime.fromISO(live.live_date_time).plus({
            hour: 1,
            minutes: 30,
          }),
        ).contains(DateTime.fromISO(nextLive)),
      )
      .some((even) => even === true);

    if (liveIsOverlapping) {
      return res.status(400).json({
        message: "Un live existe déjà pour ce créneau, veuillez le supprimer avant d'en créer un nouveau.",
      });
    }

    const live = new Live({
      seller_id: req.user.id,
      sellerName: seller.company_name,
      live_name,
      live_description,
      live_date_time: nextLive,
      business_activity: seller.business_activity,
      imageUrl: seller.imageUrl,
    });

    await live.save();
    await updateLiveStatus();
    const lives = await Live.find({ seller_id: req.user.id });

    return res.status(200).json({
      lives,
      message: 'Votre live a bien été créé !',
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: 'Un problème est survenu, réessayez plus tard.' });
  }
});

router.get('/get-seller-live', verifyJwt, async (req, res) => {
  try {
    await updateLiveStatus();

    const lives = await Live.find({ seller_id: req.user.id });

    return res.status(200).json({ lives });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: 'Un problème est survenu, réessayez plus tard.' });
  }
});

router.get('/get-lives', verifyJwt, async (req, res) => {
  try {
    const lives = await Live.find();
    return res.status(200).json({ lives });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: 'Un problème est survenu, réessayez plus tard.' });
  }
});

router.post('/delete-live', verifyJwt, async (req, res) => {
  try {
    const { _id, seller_id } = req.body.data;

    await Live.findOneAndDelete({ _id, seller_id });
    const lives = await Live.find({ seller_id: req.user.id });

    return res.status(200).json({
      lives,
      message: 'Le live a bien été supprimé.',
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: 'Un problème est survenu, réessayez plus tard.' });
  }
});

router.post('/close-live', verifyJwt, async (req, res) => {
  try {
    const liveDataToClose = req.body.data;

    await Product.updateMany({ auctionId: liveDataToClose._id, auctionsStatus: 'live' }, { auctionsStatus: 'ended' });

    await Live.findOneAndUpdate(
      { _id: liveDataToClose._id, seller_id: liveDataToClose.seller_id },
      {
        live_status: 'ended',
      },
    );

    const lives = await Live.find({ seller_id: req.user.id });

    return res.status(200).json({
      lives,
      message: 'Le live a bien été clôturé.',
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: 'Un problème est survenu, réessayez plus tard.' });
  }
});

router.post('/get-agora-token', verifyJwt, async (req, res) => {
  try {
    const { channelName } = req.body.data;
    const user = await User.findById(req.user.id);
    const seller = await UserSeller.findById(req.user.id);
    const customer = user || seller;

    let generateUid = generateUniqueId({
      length: 20,
      useNumbers: true,
      useLetters: false,
    });

    const { token } = await generateAgoraChannelToken(customer.profil, channelName, generateUid);

    return res.status(200).json({ token, generateUid });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: 'Un problème est survenu, réessayez plus tard.' });
  }
});

module.exports = router;
