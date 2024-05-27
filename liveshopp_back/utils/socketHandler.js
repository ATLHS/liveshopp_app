// @ts-check
const generateUniqueId = require('generate-unique-id');
const timer = require('time-counter');

const User = require('../models/user');
const UserSeller = require('../models/seller');

const { updateCustomer } = require('./updateCustomer');
const { isLessThanTenSeconds } = require('./helpers');
const { createChannel, getChannel, saveChannel, saveAuctionTimer, getChannels } = require('./channels');
const { log } = require('../middleware/logger');
const { registerAuction } = require('./auctions');
const Sentry = require('@sentry/node');
const Live = require('../models/live');

/**
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
module.exports = (io, socket) => {
  const leaveRoom = async ({ liveData, user }) => {
    try {
      const channelName = liveData.channelName;
      const channel = await getChannel(channelName);

      socket.leave(channelName);

      const connectedUsersCount = (await io.in(channelName).fetchSockets()).length;
      channel.userCount = connectedUsersCount;

      if ((user.profil === 'seller' && user.id === liveData.sellerId) || user._id === liveData.sellerId) {
        channel.hostIsLive = false;
      }

      await saveChannel(channel);

      io.to(channelName).emit('channelData', channel);
    } catch (error) {
      log.error(error);
      Sentry.captureException(error);
    }
  };

  /**
   *
   * @param {Object} param0
   * @param {import('../models/live').LiveType} param0.liveData
   * @param {import('../models/user').UserType} param0.user
   */
  const joinChannel = async ({ liveData, user }) => {
    try {
      const live = await Live.findById(liveData._id);
      const channelName = live.live_name;

      // 1 add user to a room
      socket.join(channelName);
      // 2 check if channel room exist
      let channel = await getChannel(channelName);
      // 3 if not => create room data linked to the seller
      if (!channel) {
        channel = await createChannel(live);
      }

      const connectedUsersCount = (await io.in(channelName).fetchSockets()).length;

      channel.userCount = connectedUsersCount;
      channel.auctionsStatus = live.live_status;

      if (!channel.hostIsLive && user.profil === 'seller' && user.id === live.seller_id) {
        channel.hostIsLive = true;
      }

      await saveChannel(channel);

      io.to(channelName).emit('channelData', channel);
    } catch (error) {
      log.error(error);
      Sentry.captureException(error);
    }
  };

  const newLiveMessage = async ({ user, message, liveData }) => {
    try {
      const channel = await getChannel(liveData.channelName);
      const pseudo = `${user.firstname} ${user.lastname.charAt(0)}.`;

      const id = generateUniqueId({
        length: 20,
        useLetters: false,
      });
      channel.messages.push({
        userId: user.id,
        profil: user.profil,
        username: pseudo,
        message: message.live_message,
        id,
      });

      await saveChannel(channel);

      io.to(liveData.channelName).emit('channelData', channel);
    } catch (error) {
      log.error(error);
      Sentry.captureException(error);
    }
  };

  const blockCustomer = async ({ user, userId, profil }) => {
    try {
      const customer = (await User.findOne({ _id: user.id })) || (await UserSeller.findOne({ _id: user.id }));
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
    } catch (error) {
      log.error(error);
      Sentry.captureException(error);
    }
  };

  const pausedCurrentAuctionStatut = async (channelName) => {
    try {
      const channel = await getChannel(channelName);
      channel.currentAuction.currentAuctionStatus = 'paused';

      await saveChannel(channel);

      io.to(channelName).emit('currentAuctionData', channel);
    } catch (error) {
      log.error(error);
      Sentry.captureException(error);
    }
  };

  const bid = async ({ channelName, data }) => {
    try {
      const channel = await getChannel(channelName);
      const { currentAuction } = channel;

      currentAuction.currentProductAmount = Number(currentAuction.currentProductAmount) + Number(data.bid);
      currentAuction.userId = data.userId;
      currentAuction.username = data.username;
      currentAuction.shipping_address = data.shipping_address;

      if (
        currentAuction.product_reserved_price &&
        currentAuction.currentProductAmount >= currentAuction.product_reserved_price
      ) {
        channel.currentAuction.currentMessageInfo = 'Prix de réserve atteint 🎉!';
      }
      let counter = currentAuction.currentAuctionDelay;

      // If there has been a bid and the time is less than 10 seconds, update the timer to 15 seconds."
      if (isLessThanTenSeconds(counter.time)) {
        // FIXME this crash counter is undefined, needs to reinstance a new one
        //
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
    } catch (error) {
      log.error(error);
      Sentry.captureException(error);
    }
  };

  const startCurrentAuction = async ({ channelName, data }) => {
    try {
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
    } catch (error) {
      log.error(error);
      Sentry.captureException(error);
    }
  };

  const startAuctionCounterForChannel = (channel) => {
    try {
      const channelName = channel.channelName;

      // When auction is finished
      channel.currentAuction.currentAuctionDelay.on('done', async () => {
        const updatedChannel = await getChannel(channelName);
        let messageInfo = '';

        // A user bidded
        if (updatedChannel.currentAuction.userId) {
          if (
            updatedChannel.currentAuction.product_reserved_price &&
            updatedChannel.currentAuction.currentProductAmount < updatedChannel.currentAuction.product_reserved_price
          ) {
            messageInfo = "Le prix de réserve n'a pas été atteint.";
          } else {
            // Charge customer and create a Product in DB
            registerAuction({
              auction: updatedChannel.currentAuction,
              auctionId: updatedChannel.auctionId,
              auctionsStatus: updatedChannel.auctionsStatus,
              sellerId: updatedChannel.sellerId,
              sellerName: updatedChannel.sellerName,
            });

            updatedChannel.currentAuction.salePrice = Number(updatedChannel.currentAuction.currentProductAmount);
          }
        }

        updatedChannel.currentAuction.currentMessageInfo = messageInfo;
        updatedChannel.currentAuction.currentAuctionStatus = 'stopping';

        // send notification to the room
        io.to(channelName).emit('currentAuctionData', updatedChannel);

        await saveChannel(updatedChannel);
      });

      // Send synchronized timer to everyone
      channel.currentAuction.currentAuctionDelay.on('change', async () => {
        await saveAuctionTimer(channel);
        const updatedChannel = await getChannel(channelName);
        io.to(channelName).emit('currentAuctionData', updatedChannel);
      });
    } catch (error) {
      log.error(error);
      Sentry.captureException(error);
    }
  };

  const restartCurrentAuctions = async () => {
    try {
      const channels = await getChannels();
      for (const channel of channels) {
        if (channel.currentAuction.currentAuctionStatus === 'running') {
          log.warn(`Restarting current auction timer for channel ${channel.channelName}`);

          const countDown = new timer({
            direction: 'down',
            startValue: `${channel.currentAuction.currentAuctionDelay.time}`,
          });

          channel.currentAuction.currentAuctionDelay = countDown;

          // Restart the timer for the current auction
          countDown.start();

          await saveChannel(channel);

          io.to(channel.channelName).emit('currentAuctionData', channel);

          // send channel data and notification for each room
          startAuctionCounterForChannel(channel);
        }
      }
    } catch (error) {
      log.error(error);
      Sentry.captureException(error);
    }
  };

  socket.on('bid', bid);
  socket.on('blockCustomer', blockCustomer);
  socket.on('joinChannel', joinChannel);
  socket.on('leaveRoom', leaveRoom);
  socket.on('newLiveMessage', newLiveMessage);
  socket.on('pausedCurrentAuctionStatut', pausedCurrentAuctionStatut);
  socket.on('startCurrentAuction', startCurrentAuction);
};
