const router = require('express').Router();
const randomNumber = require('../../utils/randomDigitNumber.js');
const {verifyJwt} = require('../../middleware/verifyJwt');
const UserSeller = require('../../models/seller');
const Live = require('../../models/live');
const {generateAgoraChannelToken} = require('../../utils/generateAgoraToken');
const {DateTime, Interval} = require("luxon");
const User = require("../../models/user");
const generateUniqueId = require('generate-unique-id');

const updateLiveStatus = async () => {
    await Live.findOneAndUpdate({
        live_date_time: {
            $gte: DateTime.now(),
            $lte: DateTime.now().plus({minutes: 30})
        },
        live_status: 'coming_soon',
    }, {
        live_status: 'live',
    })
}


router.post('/create-live', verifyJwt, async (req, res) => {
    const {live_name, live_description, live_date_time} = req.body.data;
    const seller = await UserSeller.findOne({_id: req.user.id});

    const nextLive = DateTime.fromJSDate(new Date(live_date_time)).toISO();

    const getAllLowestlives = await Live.find({
        seller_id: req.user.id,
        live_date_time: {$lte: live_date_time}
    }).exec();

    const liveIsOverlapping = getAllLowestlives.map((live) => Interval.fromDateTimes(DateTime.fromISO(live.live_date_time), DateTime.fromISO(live.live_date_time).plus({
        hour: 1,
        minutes: 30
    })).contains(DateTime.fromISO(nextLive))).some(even => even === true);

    if (liveIsOverlapping) {
        return res.status(400).json({
            message: 'Un live existe déjà pour ce créneau veuillez le supprimer avant d\'en créer un nouveau.',
        });
    } else {
        const live = new Live({
            seller_id: req.user.id,
            sellerName: seller.company_name,
            live_name,
            live_description,
            live_date_time: nextLive,
            business_activity: seller.business_activity,
            imageUrl: seller.imageUrl,
        });
        const newLiveSaved = await live.save();
        await updateLiveStatus();
        const lives = await Live.find({seller_id: req.user.id});

        if (newLiveSaved && lives) {
            return res.status(200).json({
                lives,
                message: 'Votre live a bien été crée !',
            });

        } else {
            return res.status(400).json({
                message: "Oops ! Un probleme est survenu, réessayez plus tard.",
            });
        }
    }
});

router.get('/get-seller-live', verifyJwt, async (req, res) => {
    await updateLiveStatus();
    let lives = await Live.find({seller_id: req.user.id});

    if (lives) {
        return res.status(200).json({
            lives
        });
    } else {
        return res.status(400).json({
            message: "Oops ! Un probleme est survenu, réessayez plus tard.",
        });
    }

});


router.get('/get-lives', verifyJwt, async (req, res) => {
    const lives = await Live.find();

    if (lives) {
        return res.status(200).json({
            lives
        });
    } else {
        return res.status(400).json({
            message: "Oops ! Un probleme est survenu, réessayez plus tard.",
        });
    }

});

router.post('/delete-live', verifyJwt, async (req, res) => {
    const {_id, seller_id} = req.body.data;

    await Live.findOneAndDelete({_id, seller_id});
    const lives = await Live.find({seller_id: req.user.id});

    if (lives) {
        return res.status(200).json({
            lives,
            message: "Le live a bien été supprimé."
        });
    } else {
        return res.status(400).json({
            message: "Oops ! Un probleme est survenu, réessayez plus tard.",
        });
    }

});

router.post('/close-live', verifyJwt, async (req, res) => {
    const {_id, seller_id} = req.body.data;

    await Live.findOneAndUpdate(
        {_id, seller_id},
        {
            live_status: 'ended',
        });
    const lives = await Live.find({seller_id: req.user.id});

    if (lives) {
        return res.status(200).json({
            lives,
            message: "Le live a bien été clôturé."
        });
    } else {
        return res.status(400).json({
            message: "Oops ! Un probleme est survenu, réessayez plus tard.",
        });
    }

});

router.post('/get-agora-token', verifyJwt, async (req, res) => {
    const {channelName} = req.body.data;

    const user = await User.findOne({_id: req.user.id});
    const seller = await UserSeller.findOne({_id: req.user.id});

    const customer = user || seller;
    let generateUid = generateUniqueId({
        length: 20,
        useNumbers: true,
        useLetters: false
    });;

    const {token} = await generateAgoraChannelToken(customer.profil, channelName, generateUid)
    return res.status(200).json({
        token,
        generateUid
    });
});

module.exports = router;
