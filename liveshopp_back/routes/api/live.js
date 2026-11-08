const router = require('express').Router();
const generateUniqueId = require('generate-unique-id');
const { DateTime } = require('luxon');
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
    const { live_name, live_description, live_date_time, pinned_message } = req.body.data;
    const seller = await UserSeller.findById(req.user.id);
    if (!seller) {
      return res.status(403).json({ message: req.t('errorTryAgainLater') });
    }
    const liveStartDateTime = DateTime.fromJSDate(new Date(live_date_time)).toISO();
    if (!liveStartDateTime) {
      return res.status(400).json({ message: req.t('errorTryAgainLater') });
    }

    // Retrieve all existing lives of the seller
    const existingLives = await Live.find({
      seller_id: req.user.id,
      live_status: { $in: ['coming_soon', 'live'] },
    }).exec();

    // Check if there is any overlapping live within a 1-hour interval
    const hasOverlappingLive = existingLives.some((live) => {
      const minutesApart = DateTime.fromISO(live.live_date_time).diff(DateTime.fromISO(liveStartDateTime), 'minutes').minutes;
      return Math.abs(minutesApart) < 60;
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
      pinned_message: pinned_message || '',
    });

    await newLive.save();

    const sellerLives = await Live.find({ seller_id: req.user.id }).exec();
    const lives = await Live.find().exec();
    emitFreshLives(lives);

    return res.status(200).json({
      sellerLives,
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
    const { _id } = req.body.data || {};

    const deletedLive = await Live.findOneAndDelete({ _id, seller_id: req.user.id, live_status: 'coming_soon' });
    if (!deletedLive) {
      return res.status(404).json({ message: req.t('errorTryAgainLater') });
    }
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
    const liveId = req.body.data?._id;
    const closedLive = await Live.findOneAndUpdate(
      { _id: liveId, seller_id: req.user.id, live_status: { $in: ['coming_soon', 'live'] } },
      { live_status: 'ended' },
    );
    if (!closedLive) {
      return res.status(404).json({ message: req.t('errorTryAgainLater') });
    }

    await Product.updateMany({ auctionId: liveId, auctionsStatus: 'live' }, { auctionsStatus: 'ended' });

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
    const { liveId } = req.body.data;

    const user = await User.findById(req.user.id);
    const seller = await UserSeller.findById(req.user.id);
    const customer = user || seller;
    const live = await Live.findById(liveId);
    if (!customer || !live || live.live_status === 'ended') {
      return res.status(404).json({ message: req.t('errorTryAgainLater') });
    }

    let generateUid = generateUniqueId({
      length: 20,
      useNumbers: true,
      useLetters: false,
    });

    const role = seller && live.seller_id === req.user.id ? 'seller' : 'user';
    const { token } = await generateAgoraChannelToken(role, liveId, generateUid);

    return res.status(200).json({ token, generateUid });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
});

module.exports = router;
