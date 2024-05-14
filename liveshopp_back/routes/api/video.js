const router = require("express").Router();
const { verifyJwt } = require("../../middleware/verifyJwt");
const VideosItem = require("../../models/auction_videos_items");
const AuctionVideoItem = require("../../models/auction_video");
const UserSeller = require("../../models/seller");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const generateUniqueId = require('generate-unique-id');
const multer = require('multer');
const upload = multer();
const User = require("../../models/user");
const handleAuctionVideos = require("../../utils/auctionVideosHandler");
const adjustAuctionEndTimeForTenMinutes = require("../../utils/adjustAuctionEndTimeForTenMinutes");
const {sendEmailAfterBid, sendEmailToInformOutbid} = require("../../utils/sendCodeConfirmationEmail");

const bucketName = 'auction-videos';

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

// Set interval to run every 30 minutes
// cron.schedule('*/30 * * * *', handleAuctionVideos);

router.post("/create", verifyJwt, upload.single('video'), async (req, res) => {
    const seller = await UserSeller.findOne({ _id: req.user.id });
    const data = JSON.parse(req.body.data);
    const videoFile = req.file;

    if (!seller || !videoFile) {
        return res.status(400).json({
            message: "Un problème est survenu, réessayez plus tard.",
        });
    }

    try {
        const generateUid = generateUniqueId({
            length: 20,
            useNumbers: true,
            useLetters: true
        });

        const videoData = videoFile.buffer; // Read the file data directly from the multer buffer

        const uploadParams = {
            Body: videoData,
            Bucket: bucketName,
            Key: `video/${seller._id}/${generateUid}/${videoFile.filename}.mp4`, // Utilisez le nom d'origine du fichier
            ContentType: videoFile.mimetype,
        };

        await s3Client.send(new PutObjectCommand(uploadParams));

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
            auctionStatus: 'onGoing'
        });

        const newAuctionVideoSaved = await video.save();
        const videos = await VideosItem.find({ seller_id: req.user.id });

        if (newAuctionVideoSaved) {
            return res.status(200).json({
                auctionVideos: videos,
                message: 'Votre vidéo enchère a bien été créée !',
            });
        } else {
            return res.status(500).json({ message: "Une erreur s'est produite lors de l'enregistrement de la vidéo." });
        }
    } catch (error) {
        console.error('Error uploading video to S3:', error);
        return res.status(500).json({ message: "Une erreur s'est produite lors de l'envoi de la vidéo." });
    }
});


router.get('/get-seller-auction-video', verifyJwt, async (req, res) => {
    let sellerAuctionVideo = await VideosItem.find({seller_id: req.user.id});
    if (sellerAuctionVideo) {
        return res.status(200).json({
            auctionVideos: sellerAuctionVideo,
        });
    } else {
        return res.status(400).json({
            message: "Oops ! Un probleme est survenu, réessayez plus tard.",
        });
    }
})

router.post('/handle-ending-auction-video', verifyJwt, async (req, res) => {
    const {endingAuctionId} = req.body.data;

    await handleAuctionVideos(endingAuctionId);

    try {
        const sellersAuctionVideo = await VideosItem.find({auctionStatus: 'onGoing'});
        return res.status(200).json({ auctionVideos: sellersAuctionVideo });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
})


// Endpoint to retrieve all seller auction videos with an auction date greater than the current date
router.get('/get-all-seller-auction-video', verifyJwt, async (req, res) => {
    try {
        const sellersAuctionVideo = await VideosItem.find({auctionStatus: 'onGoing', isReportedForModeration: false});
        return res.status(200).json({ auctionVideos: sellersAuctionVideo });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});


// Endpoint to create a new bid on a video
router.post('/create-new-auction-video-bid', verifyJwt, async (req, res) => {
    try {
        const data = req.body.data;
        const customer = await User.findOne({_id: req.user.id}) || await UserSeller.findOne({_id: req.user.id});

        const auctionItem = await VideosItem.findOne({ _id: data.selectedOffer._id, auctionStatus: 'onGoing' });

        // Check if there's already a bid for this item for the current user
        const existingBid = await AuctionVideoItem.findOne({ userId: customer._id, auctionItemId: auctionItem._id });

        const auctionVideos = await AuctionVideoItem.find({ auctionItemId: auctionItem._id}).sort({ amount: -1 });


        if(auctionVideos.length) {
            // Get the ID of the highest bidder
            const highestBidderId = auctionVideos[0].userId;

            // Check if the highest bidder is the same as the current bidder
            if(highestBidderId.equals(customer._id)) {
                console.log("The current bidder is also the highest bidder.");
            } else {
                // Send email notifications to the new second highest bidder who have lost the auction
                const user = await (User.findOne({_id: highestBidderId}) || UserSeller.findOne({_id: highestBidderId}));
                // const user = await (User.findOne({_id: customer._id}) || UserSeller.findOne({_id: customer._id}));
                await sendEmailToInformOutbid(user, auctionItem);
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
        await sendEmailAfterBid(customer, auctionItem);

        // Retrieve the seller's auction videos after performing the update
        const sellersAuctionVideos = await VideosItem.find({auctionStatus: 'onGoing'});

        return res.status(200).json({ auctionVideos: sellersAuctionVideos });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
});



module.exports = router;


