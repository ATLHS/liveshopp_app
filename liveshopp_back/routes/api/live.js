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
const { emitFreshLives } = require('../../utils/emitFreshLives');

router.post('/create-live', verifyJwt, async (req, res) => {
  try {
    const { live_name, live_description, live_date_time } = req.body.data;
    const seller = await UserSeller.findById(req.user.id);
    const liveStartDateTime = DateTime.fromJSDate(new Date(live_date_time)).toISO();

    // Retrieve all existing lives of the seller
    const existingLives = await Live.find({ seller_id: req.user.id, live_status: 'coming_soon' }).exec();

    // Check if there is any overlapping live within a 1-hour interval
    const hasOverlappingLive = existingLives.some((live) => {
      const liveInterval = Interval.fromDateTimes(
        DateTime.fromISO(live.live_date_time),
        DateTime.fromISO(live.live_date_time).plus({ hour: 1 }),
      );
      return liveInterval.contains(DateTime.fromISO(liveStartDateTime));
    });

    if (hasOverlappingLive) {
      return res.status(400).json({
        message: req.t('liveSlotAlreadyTaken'),
      });
    }

    const newLive = new Live({
      seller_id: req.user.id,
      sellerName: seller.company_name,
      live_name,
      live_description,
      live_date_time: liveStartDateTime,
      business_activity: seller.business_activity,
      imageUrl: seller.imageUrl,
    });

    await newLive.save();

    const lives = await Live.find().exec();
    emitFreshLives(lives);

    return res.status(200).json({
      sellerLives: existingLives,
      message: req.t('liveCreatedSuccessfully'),
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
});

router.get('/get-seller-live', verifyJwt, async (req, res) => {
  try {
    let sellerLives = await Live.find({ seller_id: req.user.id });
    return res.status(200).json({ sellerLives });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
});

router.get('/get-lives', verifyJwt, async (req, res) => {
  try {
    const lives = await Live.find();
    return res.status(200).json({ lives });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
});

router.post('/delete-live', verifyJwt, async (req, res) => {
  try {
    const { _id, seller_id } = req.body.data;

    await Live.findOneAndDelete({ _id, seller_id });
    const sellerLives = await Live.find({ seller_id: req.user.id });
    const lives = await Live.find();

    emitFreshLives(lives);
    return res.status(200).json({
      sellerLives,
      message: req.t('liveDeletedSuccessfully'),
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
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

    const sellerLives = await Live.find({ seller_id: req.user.id });

    // get and emit updated live for lives screen view
    const lives = await Live.find();
    emitFreshLives(lives);

    return res.status(200).json({
      sellerLives,
      message: req.t('liveClosedSuccessfully'),
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
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
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
});

module.exports = router;
