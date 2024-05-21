require('dotenv').config();
require('./instrument');

const express = require('express');
const Sentry = require('@sentry/node');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const generateUniqueId = require('generate-unique-id');
const { morganMiddleware, log } = require('./middleware/logger');
const timer = require('time-counter');

const Product = require('./models/product');
const User = require('./models/user');
const UserSeller = require('./models/seller');

const stripeUtils = require('./utils/stripeUtils');
const { updateCustomer } = require('./utils/updateCustomer');
const { isLessThanTenSeconds } = require('./utils/isLessThanTenSeconds');
const { createChannel, getChannel, saveChannel, saveAuctionTimer } = require('./utils/channels');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

global.io = io;

io.on('connection', (socket) => {
  socket.on('leaveRoom', async ({ liveData, user }) => {
    const channelName = liveData.channelName;
    const channel = await getChannel(channelName);

    socket.leave(channelName);
    if (channel.userCount >= 1) channel.userCount--;

    if ((user.profil === 'seller' && user.id === liveData.sellerId) || user._id === liveData.sellerId) {
      channel.hostIsLive = false;
    }
    await saveChannel(channel);

    io.to(channelName).emit('channelData', channel);
  });

  socket.on('joinChannel', async ({ liveData, user }) => {
    const channelName = liveData.live_name;
    // 1 add user to a room
    socket.join(channelName);
    // 2 check if channel room exist
    let channel = await getChannel(channelName);
    // 3 if not => create room data linked to the seller
    if (!channel) {
      channel = await createChannel(liveData, user);
    } else {
      channel.userCount++;
      channel.auctionsStatus = liveData.live_status;

      if (!channel.hostIsLive && user.profil === 'seller' && user.id === liveData.seller_id) {
        channel.hostIsLive = true;
      }
      await saveChannel(channel);
    }

    io.to(channelName).emit('channelData', channel);
  });

  socket.on('newLiveMessage', async (currentAuctionData) => {
    const { user, message, liveData } = currentAuctionData;
    const channel = await getChannel(liveData.channelName);

    const id = generateUniqueId({
      length: 20,
      useLetters: false,
    });
    channel.messages.push({
      userId: user.id,
      profil: user.profil,
      username: user.firstname,
      message: message.live_message,
      id,
    });
    await saveChannel(channel);
    io.to(liveData.channelName).emit('channelData', channel);
  });

  socket.on('blockCustomer', async (currentAuctionData) => {
    const { user, userId, profil } = currentAuctionData;

    const userCustomer = await User.findOne({ _id: user.id });
    const userSeller = await UserSeller.findOne({ _id: user.id });

    const customer = userCustomer || userSeller;

    const customerToBlock = profil === 'seller' ? { blockedSeller: userId } : { blockedUser: userId };

    // check if the customer to block is already blocked
    const isAlreadyBlocked = customer.blockedUser.concat(customer.blockedSeller).includes(userId);
    if (isAlreadyBlocked) {
      return;
    }
    const updatedCustomer = await updateCustomer(customer, customerToBlock, true);
    if (updatedCustomer) {
      const { blockedSeller, blockedUser } = updatedCustomer;
      socket.emit('hasBeenBlocked', { blockedSeller, blockedUser });
    }
  });

  socket.on('pausedCurrentAuctionStatut', async (channelName) => {
    const channel = await getChannel(channelName);
    channel.currentAuction.currentAuctionStatus = 'paused';
    await saveChannel(channel);
    io.to(channelName).emit('currentAuctionData', channel);
  });

  socket.on('bid', async (currentAuctionData) => {
    const { channelName, data } = currentAuctionData;
    const channel = await getChannel(channelName);
    const { currentAuction } = channel;

    currentAuction.currentProductAmount = Number(currentAuction.currentProductAmount) + Number(data.bid);
    currentAuction.userId = data.userId;
    currentAuction.username = data.username;
    currentAuction.shipping_address = data.shipping_address;

    if (currentAuction.product_reserved_price && currentAuction.currentProductAmount >= currentAuction.product_reserved_price) {
      channel.currentAuction.currentMessageInfo = 'Prix de réserve atteint 🎉!';
    }

    let counter = currentAuction.currentAuctionDelay;

    // If there has been a bid and the time is less than 10 seconds, update the timer to 15 seconds."
    if (isLessThanTenSeconds(counter.time)) {
      counter.stop();
      // If the remaining time is less than 10 seconds, set up a new timer for 15 seconds
      //
      // FIXME
      // Check if the counter starts again automatically
      //
      counter.updateTimer('00:00:15');
    }

    await saveChannel(channel);

    io.to(channelName).emit('currentAuctionData', channel);
  });

  const startAuctionCounterForChannel = (channel) => {
    const channelName = channel.channelName;

    // When auction is finished
    channel.currentAuction.currentAuctionDelay.on('done', async () => {
      const updatedChannel = await getChannel(channelName);
      // A user bidded
      if (updatedChannel.currentAuction.userId) {
        if (updatedChannel.currentAuction.product_reserved_price && updatedChannel.currentAuction.currentProductAmount < updatedChannel.currentAuction.product_reserved_price) {
          updatedChannel.currentAuction.currentAuctionStatus = 'stopping';
          updatedChannel.currentAuction.currentMessageInfo = "Le prix de réserve n'a pas été atteint.";
          // send notification to the room
          io.to(channelName).emit('currentAuctionData', updatedChannel);
        } else {
          // charge the current user auction winner before with stripe
          const userId = updatedChannel.currentAuction.userId;
          const amountToCharge = parseInt(updatedChannel.currentAuction.currentProductAmount.toString() * 100);

          const user = await User.findOne({ _id: userId });
          const seller = await UserSeller.findOne({ _id: userId });

          const customer = user || seller;

          const paymentIntentMetadata = {
            seller_id: updatedChannel.sellerId,
            seller_name: updatedChannel.sellerName,
            amount: updatedChannel.currentAuction.currentProductAmount,
          };
          const chargedCustomer = await stripeUtils.chargeCustomer(amountToCharge, customer.stripeCustomerId, paymentIntentMetadata);

          if (chargedCustomer.status === 'succeeded') {
            // register current sale product info in db
            const product = new Product({
              seller: updatedChannel.sellerId,
              live_name: 'Live enchères',
              auctionId: updatedChannel.auctionId,
              auctionsStatus: updatedChannel.auctionsStatus,
              userId: updatedChannel.currentAuction.userId,
              productName: updatedChannel.currentAuction.productName,
              salePrice: updatedChannel.currentAuction.currentProductAmount,
              shipping_address: updatedChannel.currentAuction.shipping_address,
            });
            // save in db the purchased product
            const newProductSaved = await product.save();

            updatedChannel.currentAuction.currentAuctionStatus = 'stopping';
            updatedChannel.currentAuction.salePrice = Number(updatedChannel.currentAuction.currentProductAmount);

            // send notification to the room
            if (newProductSaved) {
              io.to(channelName).emit('currentAuctionData', updatedChannel);
            } else {
              io.to(channelName).emit('error', { message: 'erreur' });
            }
          } else {
            // TO DO : Send a notification to the seller and to the user to inform them that the payment did not go through.
            updatedChannel.currentAuction.currentMessageInfo = '';
            updatedChannel.currentAuction.currentAuctionStatus = 'stopping';
            io.to(channelName).emit('currentAuctionData', updatedChannel);
          }
        }
      } else {
        updatedChannel.currentAuction.currentAuctionStatus = 'stopping';
        updatedChannel.currentAuction.currentMessageInfo = '';
        // send notification to the room
        io.to(channelName).emit('currentAuctionData', updatedChannel);
      }

      await saveChannel(updatedChannel);
    });

    // Send synchronized timer to everyone
    //
    // FIXME should we save the current counter to Redis?
    //
    channel.currentAuction.currentAuctionDelay.on('change', async () => {
      await saveAuctionTimer(channel);
      const updatedChannel = await getChannel(channelName);
      io.to(channelName).emit('currentAuctionData', updatedChannel);
    });
  };

  socket.on('startCurrentAuction', async (currentAuctionData) => {
    const { channelName, data } = currentAuctionData;
    const channel = await getChannel(channelName);
    const countDown = new timer({
      direction: 'down',
      startValue: `${data.product_auction_time}:00`,
    });

    channel.currentAuction.productName = data.product_name;
    channel.currentAuction.currentProductAmount = data.product_price;
    channel.currentAuction.product_reserved_price = data.product_reserved_price || false;
    channel.currentAuction.currentAuctionDelay = countDown;
    channel.currentAuction.currentAuctionStatus = 'running';
    channel.currentAuction.username = '';
    channel.currentAuction.userId = '';
    channel.currentAuction.salePrice = '';
    channel.currentAuction.currentMessageInfo = data.product_reserved_price ? 'Prix de réserve non atteint...' : '';

    // start the timer for the current auction
    countDown.start();

    await saveChannel(channel);

    io.to(channelName).emit('currentAuctionData', channel);

    // send channel data and notification for each room
    startAuctionCounterForChannel(channel);
  });
});

app.use(morganMiddleware);
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
    limit: '35mb',
    parameterLimit: 50000,
  }),
);
app.use(express.json({ limit: '35mb' }));
app.use(express.static('public'));

const auth = require('./routes/api/auth');
const customer = require('./routes/api/customer');
const live = require('./routes/api/live');
const order = require('./routes/api/order');
const stripe = require('./routes/api/stripe');
const admin = require('./routes/api/admin');
const videos = require('./routes/api/video');

app.use('/api/auth/', auth);
app.use('/api/customer/', customer);
app.use('/api/live/', live);
app.use('/api/order/', order);
app.use('/api/stripe/', stripe);
app.use('/api/admin/', admin);
app.use('/api/videos/', videos);

Sentry.setupExpressErrorHandler(app);

httpServer.listen(process.env.PORT, () => {
  log.info(`Server listening on port ${process.env.PORT}`);
});

module.exports = { app, httpServer };
