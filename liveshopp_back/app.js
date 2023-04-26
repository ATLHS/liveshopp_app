require("dotenv").config();
const {createServer} = require("http");
const express = require("express");
const app = express();
const {Server} = require("socket.io");
const cors = require("cors");
const port = 5000;
const mongoose = require("mongoose");
const timer = require('time-counter');
const Product = require('./models/product');
const stripeUtils = require("./utils/stripeUtils");
const generateUniqueId = require('generate-unique-id');

const httpServer = createServer(app);
const io = new Server(httpServer);
const channels = new Map();

console.log("Hello Liveshopp");

io.on("connection", (socket) => {
    socket.on("leaveRoom", ({liveData, user}) => {
        let channel = channels.get(liveData.channelName);
        socket.leave(channel.channelName);
        if (channel.userCount >= 1) channel.userCount--;

        if (user.profil === "seller" && user.id === liveData.sellerId) {
            channel.hostIsLive = false;
        }
        ;
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
                userCount: 1,
                messages: [],
                hostIsLive: user.profil === "seller" && user.id === liveData.seller_id,
                currentAuction: {
                    userId: '',
                    username: '',
                    productName: '',
                    currentProductAmount: '',
                    currentAuctionDelay: new timer(),
                    currentAuctionStatus: 'paused',
                    salePrice: '',
                }
            }
            channels.set(liveData.live_name, channelRoomData);
            // 4 send data to the client who join the specified room
            io.to(liveData.live_name).emit("channelData", channels.get(liveData.live_name));
        } else {
            channels.get(liveData.live_name).userCount++;
            if (!channels.get(liveData.live_name).hostIsLive && user.profil === "seller" && user.id === liveData.seller_id) {
                channels.get(liveData.live_name).hostIsLive = true;
            }
            ;
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
        channelRoom.messages.push({username: user.firstname, message: message.live_message, id });
        io.to(liveData.channelName).emit("channelData", channelRoom);
    });

    socket.on("pausedCurrentAuctionStatut", (channelName) => {
        const channelRoom = channels.get(channelName);
        channelRoom.currentAuction.currentAuctionStatus = 'paused';
    });


    socket.on("bid", (currentAuctionData) => {
        const {channelName, data} = currentAuctionData;

        const channelRoom = channels.get(channelName);

        channelRoom.currentAuction.currentProductAmount = Number(channelRoom.currentAuction.currentProductAmount) + Number(data.bid);
        channelRoom.currentAuction.userId = data.userId;
        channelRoom.currentAuction.username = data.username;
        channelRoom.currentAuction.shipping_address = data.shipping_address;

        io.to(channelName).emit("currentAuctionData", channelRoom);
    });


    const sendCurrentAuctionCounterToEachRooms = () => {
        for (let [key, value] of channels) {
            // get the current timer of each channel room and check if timer is done
            value.currentAuction.currentAuctionDelay.on('done', async () => {
                if (value.currentAuction.userId) {
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
                            seller_id: value.sellerId,
                            live_name: key,
                            auctionId: value.auctionId,
                            auctionsStatus: value.auctionsStatus,
                            userId: value.currentAuction.userId,
                            productName: value.currentAuction.productName,
                            salePrice: value.currentAuction.currentProductAmount,
                            shipping_address: value.currentAuction.shipping_address,
                            seller: value.sellerId,
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
                    }
                } else {
                    value.currentAuction.currentAuctionStatus = 'stopping';
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
        channelRoom.currentAuction.currentAuctionDelay = countDown;
        channelRoom.currentAuction.currentAuctionStatus = 'running';
        channelRoom.currentAuction.username = '';
        channelRoom.currentAuction.userId = '';
        channelRoom.currentAuction.salePrice = '';

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
    .connect(url, {useNewUrlParser: true})
    .then(() => console.log(`Database connected successfully`))
    .catch((err) => console.log(err));

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

const auth = require("./routes/api/auth");
const customer = require("./routes/api/customer");
const live = require("./routes/api/live");
const order = require("./routes/api/order");
const stripe = require("./routes/api/stripe");
const User = require("./models/user");
const UserSeller = require("./models/seller");

app.use("/api/auth/", auth);
app.use("/api/customer/", customer);
app.use("/api/live/", live);
app.use("/api/order/", order);
app.use("/api/stripe/", stripe);

httpServer.listen(port, () => console.log(`Server listening on port  ${port}`));
