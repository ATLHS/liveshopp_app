const router = require('express').Router();
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const generateUniqueId = require('generate-unique-id');
const multer = require('multer');
const Sentry = require('@sentry/node');
const { log } = require('../../middleware/logger');
const { verifyJwt } = require('../../middleware/verifyJwt');
const { s3 } = require('../../utils/services');
const VideosItem = require('../../models/auction_videos_items');
const AuctionVideoItem = require('../../models/auction_video');
const UserSeller = require('../../models/seller');
const upload = multer();
const User = require('../../models/user');
const handleAuctionVideos = require('../../utils/auctionVideosHandler');
const adjustAuctionEndTimeForTenMinutes = require('../../utils/helpers');
const { sendEmailAfterBid, sendEmailToInformOutbid } = require('../../utils/emails');

// Set interval to run every 30 minutes
// cron.schedule('*/30 * * * *', handleAuctionVideos);

router.post('/create', verifyJwt, upload.single('video'), async (req, res) => {
  try {
    const seller = await UserSeller.findById(req.user.id);
    const data = JSON.parse(req.body.data);
    const videoFile = req.file;

    if (!seller || !videoFile) {
      return res.status(400).json({ message: req.t('errorTryAgainLater') });
    }

    const generateUid = generateUniqueId({
      length: 20,
      useNumbers: true,
      useLetters: true,
    });

    const videoData = videoFile.buffer; // Read the file data directly from the multer buffer

    const uploadParams = {
      Body: videoData,
      Bucket: 'auction-videos',
      Key: `video/${seller._id}/${generateUid}/${videoFile.filename}.mp4`, // FIXME should use the original file name, setting randomely mp4 wont work
      ContentType: videoFile.mimetype,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const auctionVideoUrl = `https://${process.env.CLOUDFRONT_DOMAIN_NAME}/${uploadParams.Key}`;

    const video = new VideosItem({
      seller_id: req.user.id,
      sellerName: seller.company_name,
      productName: data.productName,
      productDescription: data.productDescription,
      startingPrice: data.startingPrice,
      reservePrice: data.reservePrice,
      videoUrl: auctionVideoUrl,
      auctionEndDate: data.live_date_time,
      auctionStatus: 'onGoing',
    });

    await video.save();
    const videos = await VideosItem.find({ seller_id: req.user.id });

    return res.status(200).json({
      auctionVideos: videos,
      message: req.t('auctionVideoCreatedSuccessfully'),
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
});

router.get('/get-seller-auction-video', verifyJwt, async (req, res) => {
  try {
    const sellerAuctionVideo = await VideosItem.find({ seller_id: req.user.id });

    if (sellerAuctionVideo) {
      return res.status(200).json({ auctionVideos: sellerAuctionVideo });
    }

    return res.status(400).json({ message: req.t('errorTryAgainLater') });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
});

router.post('/handle-ending-auction-video', verifyJwt, async (req, res) => {
  try {
    const { endingAuctionId } = req.body.data;

    await handleAuctionVideos(endingAuctionId, req);

    const sellersAuctionVideo = await VideosItem.find({ auctionStatus: 'onGoing' });

    return res.status(200).json({ auctionVideos: sellersAuctionVideo });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
});

// Endpoint to retrieve all seller auction videos with an auction date greater than the current date
router.get('/get-all-seller-auction-video', verifyJwt, async (req, res) => {
  try {
    const sellersAuctionVideo = await VideosItem.find({ auctionStatus: 'onGoing', isReportedForModeration: false });

    return res.status(200).json({ auctionVideos: sellersAuctionVideo });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
});

// Endpoint to create a new bid on a video
router.post('/create-new-auction-video-bid', verifyJwt, async (req, res) => {
  try {
    const data = req.body.data;
    const customer = (await User.findById(req.user.id)) || (await UserSeller.findById(req.user.id));
    const auctionItem = await VideosItem.findOne({ _id: data.selectedOffer._id, auctionStatus: 'onGoing' });

    // Check if there's already a bid for this item for the current user
    const existingBid = await AuctionVideoItem.findOne({ userId: customer._id, auctionItemId: auctionItem._id });

    const auctionVideos = await AuctionVideoItem.find({ auctionItemId: auctionItem._id }).sort({ amount: -1 });

    if (auctionVideos.length) {
      // Get the ID of the highest bidder
      const highestBidderId = auctionVideos[0].userId;

      // Check if the highest bidder is the same as the current bidder
      if (highestBidderId.equals(customer._id)) {
        log.debug('The current bidder is also the highest bidder.');
      } else {
        // Send email notifications to the new second highest bidder who have lost the auction
        const user = await (User.findById(highestBidderId) || UserSeller.findById(highestBidderId));

        await sendEmailToInformOutbid(user, auctionItem, req);
      }
    }

    const model = customer.profil === 'user' ? 'User' : 'Seller';
    // Update or create bid
    if (existingBid) {
      existingBid.amount = data.bid_offer;
      await existingBid.save();
    } else {
      const newBid = new AuctionVideoItem({
        userId: customer._id,
        docModel: model,
        amount: data.bid_offer,
        auctionItemId: auctionItem._id,
      });
      await newBid.save();
    }

    // Update auction item details
    auctionItem.currentPrice = data.bid_offer;
    auctionItem.bestBidderUsername = customer.firstname;
    auctionItem.auctionEndDate = adjustAuctionEndTimeForTenMinutes(auctionItem.auctionEndDate);

    if (data.bid_offer >= auctionItem.reservePrice) {
      auctionItem.winningBidderId = customer._id;
      auctionItem.docModel = model;
      auctionItem.winningBidderUsername = customer.firstname;
    }
    await auctionItem.save();

    // Send email notification to the user after bidding
    await sendEmailAfterBid(customer, auctionItem, req);

    // Retrieve the seller's auction videos after performing the update
    const sellersAuctionVideos = await VideosItem.find({ auctionStatus: 'onGoing' });

    return res.status(200).json({ auctionVideos: sellersAuctionVideos });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: req.t('errorTryAgainLater') });
  }
});

module.exports = router;
