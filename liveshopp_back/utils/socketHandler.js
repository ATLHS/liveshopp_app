// @ts-check
const generateUniqueId = require('generate-unique-id');

const User = require('../models/user');
const UserSeller = require('../models/seller');

const { updateCustomer } = require('./updateCustomer');
const { createChannel, getChannel, saveChannel, getChannels, updateTimer } = require('./channels');
const { log } = require('../middleware/logger');
const { registerAuction } = require('./auctions');
const Sentry = require('@sentry/node');
const Live = require('../models/live');

/**
 * @param {import('socket.io').Server} io
 */
module.exports = (io) => {
  const leaveRoom = async function ({ liveData, user }) {
    try {
      const socket = this;
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
   * @param {import('../models/live').LiveType._id} param0.liveId
   * @param {import('../models/user').UserType} param0.user
   */
  const joinChannel = async function ({ liveId, user }) {
    try {
      const socket = this;
      const live = await Live.findById(liveId);
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

  const newLiveMessage = async function ({ user, message, liveData }) {
    try {
      const channel = await getChannel(liveData.channelName);
      const pseudo = `${user.firstname} ${user.lastname.charAt(0)}`;

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

  const blockCustomer = async function ({ user, userId, profil }) {
    try {
      const socket = this;
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

  const bid = async function ({ channelName, data }) {
    try {
      const bidAmount = Number(data.bid);
      const channel = await getChannel(channelName);
      const { currentAuction } = channel;

      // FIXME
      //
      // This is a quick fix.
      // It should be correctly handled in params validation.
      //
      if (isNaN(bidAmount) || bidAmount <= 0) {
        throw new Error('Dangerous bid amount detected');
      }

      currentAuction.currentProductAmount = Number(currentAuction.currentProductAmount) + bidAmount;
      currentAuction.userId = data.userId;
      currentAuction.username = data.username;
      currentAuction.shipping_address = data.shipping_address;

      if (
        currentAuction.product_reserved_price &&
        currentAuction.currentProductAmount >= currentAuction.product_reserved_price
      ) {
        channel.currentAuction.currentMessageInfo = 'Prix de réserve atteint 🎉!';
      }

      // If there has been a bid and the time is less than 10 seconds, update the timer to 15 seconds."
      if (currentAuction.currentAuctionTimer <= 10) {
        channel.currentAuction.currentAuctionTimer = 15;
      }

      await saveChannel(channel);

      io.to(channelName).emit('currentAuctionData', channel);
    } catch (error) {
      log.error(error);
      Sentry.captureException(error);
    }
  };

  const startCurrentAuction = async function ({ channelName, data }) {
    try {
      const channel = await getChannel(channelName);
      const timer = data.product_auction_time * 60; // in seconds

      channel.currentAuction.productName = data.product_name;
      channel.currentAuction.currentProductAmount = data.product_price;
      channel.currentAuction.product_reserved_price = data.product_reserved_price || false;
      channel.currentAuction.currentAuctionTimer = timer;
      channel.currentAuction.currentAuctionStatus = 'running';
      channel.currentAuction.username = '';
      channel.currentAuction.userId = '';
      channel.currentAuction.salePrice = '';
      channel.currentAuction.currentMessageInfo = data.product_reserved_price ? 'Prix de réserve non atteint...' : '';

      await saveChannel(channel);

      io.to(channelName).emit('currentAuctionData', channel);

      startTimer(channelName);
    } catch (error) {
      log.error(error);
      Sentry.captureException(error);
    }
  };

  const restartAllChannelsAuctions = async () => {
    try {
      const channels = await getChannels();
      for (const channel of channels) {
        if (channel.currentAuction.currentAuctionStatus === 'running') {
          const channelName = channel.channelName;
          log.warn(`Restarting current auction timer for channel ${channelName}`);
          startTimer(channelName);
        }
      }
    } catch (error) {
      log.error(error);
      Sentry.captureException(error);
    }
  };

  // Timer ticks every second, no matter how long the processing takes
  const startTimer = async (channelName) => {
    const interval = setInterval(async () => {
      const result = await updateTimer(channelName);
      const updatedTimer = result[0];

      const channel = await getChannel(channelName);

      io.to(channelName).emit('currentAuctionData', channel);

      // stop the timer
      if (updatedTimer <= 0) {
        clearInterval(interval);
        onAuctionFinished(channelName);
      }
    }, 1000);
  };

  const onAuctionFinished = async function (channelName) {
    try {
      const channel = await getChannel(channelName);
      let messageInfo = '';

      // A user bidded
      if (channel.currentAuction.userId) {
        if (
          channel.currentAuction.product_reserved_price &&
          channel.currentAuction.currentProductAmount < channel.currentAuction.product_reserved_price
        ) {
          messageInfo = "Le prix de réserve n'a pas été atteint.";
        } else {
          // Charge customer and create a Product in DB
          registerAuction({
            auction: channel.currentAuction,
            auctionId: channel.auctionId,
            auctionsStatus: channel.auctionsStatus,
            sellerId: channel.sellerId,
            sellerName: channel.sellerName,
          });

          channel.currentAuction.salePrice = Number(channel.currentAuction.currentProductAmount);
        }
      }

      channel.currentAuction.currentMessageInfo = messageInfo;
      channel.currentAuction.currentAuctionStatus = 'stopping';

      // send notification to the room
      io.to(channelName).emit('currentAuctionData', channel);

      await saveChannel(channel);
    } catch (error) {
      log.error(error);
      Sentry.captureException(error);
    }
  };

  return {
    bid,
    blockCustomer,
    joinChannel,
    leaveRoom,
    newLiveMessage,
    pausedCurrentAuctionStatut,
    restartAllChannelsAuctions,
    startCurrentAuction,
  };
};
