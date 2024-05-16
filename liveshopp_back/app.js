require("dotenv").config();
require("./instrument");
const {createServer} = require("http");
const Sentry = require("@sentry/node");
const express = require("express");
const app = express();

const {Server} = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const timer = require('time-counter');
const Product = require('./models/product');
const stripeUtils = require("./utils/stripeUtils");
const generateUniqueId = require('generate-unique-id');
const {updateCustomer} = require("./utils/updateCustomer");
const {isLessThanTenSeconds} = require("./utils/isLessThanTenSeconds");
const User = require("./models/user");
const UserSeller = require("./models/seller");

// The Sentry request handler middleware must be added before any other handlers
app.use(Sentry.Handlers.requestHandler());
// Performance Monitoring: Create spans and traces for every incoming request
app.use(Sentry.Handlers.tracingHandler());
// The Sentry error handler middleware must be registered before any other error middleware and after all controllers
app.use(
    Sentry.Handlers.errorHandler({
        shouldHandleError(error) {
            console.log(error, error.status)
            // Capture all errors
            if (error.status >= 400) {
                return true
            }
            return false
        },
    })
);

const httpServer = createServer(app);
const io = new Server(httpServer);
const channels = new Map();
global.io = io;

io.on("connection", (socket) => {
    socket.on("leaveRoom", ({liveData, user}) => {
        let channel = channels.get(liveData.channelName);
        socket.leave(channel.channelName);
        if (channel.userCount >= 1) channel.userCount--;

        if (user.profil === "seller" && user.id === liveData.sellerId || user._id === liveData.sellerId) {
            channel.hostIsLive = false;
        };
        io.to(liveData.channelName).emit("channelData", channel);
    });

    socket.on("joinChannel", ({liveData, user}) => {
        // 1 add user to a room
        socket.join(liveData.live_name);
        // 2 check if channel room exist
        const channelRooms = channels.has(liveData.live_name);
        // 3 if not => create room data linked to the seller
        if (!channelRooms) {
            const channelRoomData = {
                channelName: liveData.live_name,
                sellerId: liveData.seller_id,
                sellerName: liveData.sellerName,
                auctionId: liveData._id,
                auctionsStatus: liveData.live_status,
                liveSchedule: liveData.live_date_time,
                userCount: 1,
                messages: [],
                hostIsLive: user.profil === "seller" && user.id === liveData.seller_id,
                currentAuction: {
                    userId: '',
                    username: '',
                    productName: '',
                    currentProductAmount: '',
                    product_reserved_price: '',
                    currentAuctionDelay: new timer(),
                    currentAuctionStatus: 'paused',
                    salePrice: '',
                    currentMessageInfo: '',
                }
            }
            channels.set(liveData.live_name, channelRoomData);
            // 4 send data to the client who join the specified room
            io.to(liveData.live_name).emit("channelData", channels.get(liveData.live_name));
        } else {
            channels.get(liveData.live_name).userCount++;
            channels.get(liveData.live_name).auctionsStatus = liveData.live_status;

            if (!channels.get(liveData.live_name).hostIsLive && user.profil === "seller" && user.id === liveData.seller_id) {
                channels.get(liveData.live_name).hostIsLive = true;
            };
            // 3 if room exist send room data to the client who join the specified room
            io.to(liveData.live_name).emit("channelData", channels.get(liveData.live_name));
        }

    });

    socket.on("newLiveMessage", (currentAuctionData) => {
        const {user, message, liveData} = currentAuctionData;

        const channelRoom = channels.get(liveData.channelName);
        const id = generateUniqueId({
            length: 20,
            useLetters: false
        });
        channelRoom.messages.push({
            userId: user.id,
            profil: user.profil,
            username: user.firstname,
            message: message.live_message,
            id
        });
        io.to(liveData.channelName).emit("channelData", channelRoom);
    });

    socket.on("blockCustomer", async (currentAuctionData) => {
        const {user, userId, profil} = currentAuctionData;

        const userCustomer = await User.findOne({_id: user.id});
        const userSeller = await UserSeller.findOne({_id: user.id});

        const customer = userCustomer || userSeller;

        const customerToBlock = profil === "seller" ? {blockedSeller: userId} : {blockedUser: userId};

        // check if the customer to block is already blocked
        const isAlreadyBlocked = customer.blockedUser.concat(customer.blockedSeller).includes(userId);
        if (isAlreadyBlocked) {
            return;
        }
        const updatedCustomer = await updateCustomer(customer, customerToBlock, true);
        if (updatedCustomer) {
            const {blockedSeller, blockedUser} = updatedCustomer;
            socket.emit('hasBeenBlocked', {blockedSeller, blockedUser});
        }
    });


    socket.on("pausedCurrentAuctionStatut", (channelName) => {
        const channelRoom = channels.get(channelName);
        channelRoom.currentAuction.currentAuctionStatus = 'paused';
        io.to(channelName).emit("currentAuctionData", channelRoom);
    });


    socket.on("bid", (currentAuctionData) => {
        const {channelName, data} = currentAuctionData;

        const channelRoom = channels.get(channelName);

        const {currentAuction} = channelRoom;

        currentAuction.currentProductAmount = Number(currentAuction.currentProductAmount) + Number(data.bid);
        currentAuction.userId = data.userId;
        currentAuction.username = data.username;
        currentAuction.shipping_address = data.shipping_address;

        if (currentAuction.product_reserved_price && currentAuction.currentProductAmount >= currentAuction.product_reserved_price) {
            channelRoom.currentAuction.currentMessageInfo = 'Prix de réserve atteint 🎉!';
        }

        let counter = currentAuction.currentAuctionDelay;

        // If there has been a bid and the time is less than 10 seconds, update the timer to 15 seconds."
        if (isLessThanTenSeconds(counter.time)) {
            counter.stop();
            // If the remaining time is less than 10 seconds, set up a new timer for 15 seconds
            counter.updateTimer('00:00:15');
        }

        io.to(channelName).emit("currentAuctionData", channelRoom);
    });


    const sendCurrentAuctionCounterToEachRooms = () => {
        for (let [key, value] of channels) {
            // get the current timer of each channel room and check if timer is done
            value.currentAuction.currentAuctionDelay.on('done', async () => {
                if (value.currentAuction.userId) {
                    if (value.currentAuction.product_reserved_price && value.currentAuction.currentProductAmount < value.currentAuction.product_reserved_price) {
                        value.currentAuction.currentAuctionStatus = 'stopping';
                        value.currentAuction.currentMessageInfo = 'Oops! Le prix de réserve n\'a pas été atteint.';
                        // send notification to the room
                        io.to(key).emit("currentAuctionData", value);
                    } else {
                        // charge the current user auction winner before with stripe
                        const userId = value.currentAuction.userId;
                        const amountToCharge = parseInt(value.currentAuction.currentProductAmount.toString() * 100);

                        const user = await User.findOne({_id: userId});
                        const seller = await UserSeller.findOne({_id: userId});

                        const customer = user || seller;

                        const paymentIntentMetadata = {
                            seller_id: value.sellerId,
                            seller_name: value.sellerName,
                            amount: value.currentAuction.currentProductAmount
                        };
                        const chargedCustomer = await stripeUtils.chargeCustomer(amountToCharge, customer.stripeCustomerId, paymentIntentMetadata);

                        if (chargedCustomer.status === 'succeeded') {
                            // register current sale product info in db
                            const product = new Product({
                                seller: value.sellerId,
                                live_name: 'Live enchères',
                                auctionId: value.auctionId,
                                auctionsStatus: value.auctionsStatus,
                                userId: value.currentAuction.userId,
                                productName: value.currentAuction.productName,
                                salePrice: value.currentAuction.currentProductAmount,
                                shipping_address: value.currentAuction.shipping_address,
                            });
                            // save in db the purchased product
                            const newProductSaved = await product.save();

                            value.currentAuction.currentAuctionStatus = 'stopping';
                            value.currentAuction.salePrice = Number(value.currentAuction.currentProductAmount);

                            // send notification to the room
                            if (newProductSaved) {
                                io.to(key).emit("currentAuctionData", value);
                            } else {
                                io.to(key).emit("error", {message: 'erreur'});
                            }
                        } else {
                            // TO DO : Send a notification to the seller and to the user to inform them that the payment did not go through.
                            value.currentAuction.currentMessageInfo = '';
                            value.currentAuction.currentAuctionStatus = 'stopping';
                            io.to(key).emit("currentAuctionData", value);
                        }
                    }
                } else {
                    value.currentAuction.currentAuctionStatus = 'stopping';
                    value.currentAuction.currentMessageInfo = '';
                    // send notification to the room
                    io.to(key).emit("currentAuctionData", value);
                }
            })
            // get the current delay of each channel room and send the current delay in seconds
            value.currentAuction.currentAuctionDelay.on('change', () => {
                io.to(key).emit("currentAuctionData", value);
            })
        }
    }

    // start current auction
    socket.on("startCurrentAuction", (currentAuctionData) => {
        const {channelName, data} = currentAuctionData;
        const channelRoom = channels.get(channelName);
        const countDown = new timer({
            direction: 'down',
            startValue: `${data.product_auction_time}:00`
        });

        channelRoom.currentAuction.productName = data.product_name;
        channelRoom.currentAuction.currentProductAmount = data.product_price;
        channelRoom.currentAuction.product_reserved_price = data.product_reserved_price || false;
        channelRoom.currentAuction.currentAuctionDelay = countDown;
        channelRoom.currentAuction.currentAuctionStatus = 'running';
        channelRoom.currentAuction.username = '';
        channelRoom.currentAuction.userId = '';
        channelRoom.currentAuction.salePrice = '';
        channelRoom.currentAuction.currentMessageInfo = data.product_reserved_price ? 'Prix de réserve non atteint...' : '';

        // start the timer for the current auction
        countDown.start();

        io.to(channelName).emit("currentAuctionData", channelRoom);

        // send channel data and notification for each room
        sendCurrentAuctionCounterToEachRooms();
    });
});

// db config
const url = process.env.ATLAS_URL;
mongoose
    .connect(url)
    .then(() => console.log(`Database connected successfully`))
    .catch((err) => console.error(err));

app.use(cors());
app.use(express.urlencoded({
    extended: true,
    limit: '35mb',
    parameterLimit: 50000,
}));
app.use(express.json({limit: '35mb'}));
app.use(express.static("public"));

const auth = require("./routes/api/auth");
const customer = require("./routes/api/customer");
const live = require("./routes/api/live");
const order = require("./routes/api/order");
const stripe = require("./routes/api/stripe");
const admin = require("./routes/api/admin");
const videos = require("./routes/api/video");

app.use("/api/auth/", auth);
app.use("/api/customer/", customer);
app.use("/api/live/", live);
app.use("/api/order/", order);
app.use("/api/stripe/", stripe);
app.use("/api/admin/", admin);
app.use("/api/videos/", videos);

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

httpServer.listen(process.env.PORT, () => { console.log(`Server listening on port  ${process.env.PORT}`); });


module.exports = {app, httpServer}