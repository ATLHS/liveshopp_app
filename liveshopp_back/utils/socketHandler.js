// @ts-check
const generateUniqueId = require('generate-unique-id');

const User = require('../models/user');
const UserSeller = require('../models/seller');

const { updateCustomer } = require('./updateCustomer');
const { createChannel, getChannel, saveChannel, getChannels, updateTimer, addChatMessage } = require('./channels');
const { sendLiveIsStarting } = require('./notifications');
const { log } = require('../middleware/logger');
const { registerAuction } = require('./auctions');
const Sentry = require('@sentry/node');
const Live = require('../models/live');

/**
 * @param {import('socket.io').Server} io
 */
module.exports = (io) => {
  const auctionTimers = new Map();
  const leaveRoom = async function ({ liveId } = {}) {
    try {
      const socket = this;
      const channel = await getChannel(liveId);
      if (!channel || !socket.rooms.has(liveId)) return;

      await socket.leave(liveId);

      const connectedSockets = await io.in(liveId).fetchSockets();
      channel.userCount = connectedSockets.length;
      channel.hostIsLive = connectedSockets.some((connectedSocket) => connectedSocket.data.user?.id === channel.sellerId);

      await saveChannel(channel);

      io.to(liveId).emit('channelData', channel);
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
  const joinChannel = async function ({ liveId } = {}) {
    try {
      const socket = this;
      const live = await Live.findById(liveId);
      if (!live || live.live_status === 'ended') return;
      const user = socket.data.user;

      // 1 add user to a room
      socket.join(liveId);
      // 2 check if channel room exist
      let channel = await getChannel(liveId);
      // 3 if not => create room data linked to the seller
      if (!channel) {
        channel = await createChannel(live);
      }

      const connectedUsersCount = (await io.in(liveId).fetchSockets()).length;

      channel.userCount = connectedUsersCount;

      if (!channel.hostIsLive && user.profil === 'seller' && user.id === live.seller_id) {
        channel.hostIsLive = true;
        live.live_status = 'live';

        if (channel.notificationSent === false) {
          sendLiveIsStarting(live);
          channel.notificationSent = true;
        }

        await live.save();
      }

      channel.auctionsStatus = live.live_status;
      await saveChannel(channel);

      io.to(liveId).emit('channelData', channel);
    } catch (error) {
      log.error(error);
      Sentry.captureException(error);
    }
  };

  const newLiveMessage = async function ({ message, liveId } = {}) {
    try {
      if (!this.rooms.has(liveId) || typeof message?.live_message !== 'string' || !message.live_message.trim()) return;
      const user = this.data.user;
      const pseudo = `${user.firstname} ${user.lastname.charAt(0)}`;
      const id = generateUniqueId({
        length: 20,
        useLetters: false,
      });
      const payload = {
        userId: user.id,
        profil: user.profil,
        username: pseudo,
        message: message.live_message.trim().slice(0, 1000),
        id,
      };

      await addChatMessage(liveId, payload);

      io.to(liveId).emit('newChatMessage', payload);
    } catch (error) {
      log.error(error);
      Sentry.captureException(error);
    }
  };

  const blockCustomer = async function ({ userId, profil } = {}) {
    try {
      const socket = this;
      const customer = (await User.findById(socket.data.user.id)) || (await UserSeller.findById(socket.data.user.id));
      if (!customer || !userId || userId === socket.data.user.id || !['user', 'seller'].includes(profil)) return;
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

  const pausedCurrentAuctionStatus = async function (liveId) {
    try {
      const channel = await getChannel(liveId);
      if (!channel || channel.sellerId !== this.data.user.id || !this.rooms.has(liveId)) return;
      if (channel.currentAuction.currentAuctionStatus !== 'stopping') return;
      channel.currentAuction.currentAuctionStatus = 'paused';

      await saveChannel(channel);

      io.to(liveId).emit('currentAuctionData', channel.currentAuction);
    } catch (error) {
      log.error(error);
      Sentry.captureException(error);
    }
  };

  const bid = async function ({ liveId, data } = {}) {
    try {
      const bidAmount = Number(data?.bid);
      const channel = await getChannel(liveId);
      const user = this.data.user;
      if (!channel || !this.rooms.has(liveId) || channel.sellerId === user.id) return;
      const customer = (await User.findById(user.id)) || (await UserSeller.findById(user.id));
      if (!customer || customer.isBanned || !customer.hasValidPaymentMethod || !customer.shipping_address) return;
      const { currentAuction } = channel;
      if (currentAuction.currentAuctionStatus !== 'running' || currentAuction.currentAuctionTimer <= 0) return;

      // FIXME
      //
      // This is a quick fix.
      // It should be correctly handled in params validation.
      //
      if (!Number.isFinite(bidAmount) || bidAmount <= 0 ||
        !Number.isSafeInteger(Math.round(bidAmount * 100)) ||
        Math.abs(bidAmount * 100 - Math.round(bidAmount * 100)) > 1e-7) {
        throw new Error('Dangerous bid amount detected');
      }

      const nextAmountInCents = Math.round(Number(currentAuction.currentProductAmount) * 100) + Math.round(bidAmount * 100);
      if (!Number.isSafeInteger(nextAmountInCents)) return;
      currentAuction.currentProductAmount = nextAmountInCents / 100;
      currentAuction.userId = user.id;
      currentAuction.username = `${customer.firstname} ${customer.lastname.charAt(0)}`;
      currentAuction.shipping_address = customer.shipping_address;

      if (
        currentAuction.product_reserved_price &&
        currentAuction.currentProductAmount >= currentAuction.product_reserved_price
      ) {
        channel.currentAuction.currentMessageInfo = 'reservePriceReached';
      }

      // If there has been a bid and the time is less than 10 seconds, update the timer to 15 seconds."
      if (currentAuction.currentAuctionTimer <= 10) {
        channel.currentAuction.currentAuctionTimer = 15;
      }

      await saveChannel(channel);

      io.to(liveId).emit('currentAuctionData', channel.currentAuction);
    } catch (error) {
      log.error(error);
      Sentry.captureException(error);
    }
  };

  const startCurrentAuction = async function ({ liveId, data } = {}) {
    try {
      const channel = await getChannel(liveId);
      if (!channel || !this.rooms.has(liveId) || channel.sellerId !== this.data.user.id) return;
      if (channel.currentAuction.currentAuctionStatus === 'running') return;
      const auctionMinutes = Number(data?.product_auction_time);
      const startingPrice = Number(data?.product_price);
      const reservePrice = data?.product_reserved_price ? Number(data.product_reserved_price) : 0;
      if (!Number.isFinite(auctionMinutes) || auctionMinutes <= 0 || auctionMinutes > 60) return;
      if (!Number.isFinite(startingPrice) || startingPrice < 0 || !Number.isFinite(reservePrice)) return;
      if (reservePrice && reservePrice <= startingPrice) return;
      if (typeof data.product_name !== 'string' || !data.product_name.trim()) return;
      const timer = auctionMinutes * 60;

      channel.currentAuction.productName = data.product_name.trim();
      channel.currentAuction.currentProductAmount = startingPrice;
      channel.currentAuction.product_reserved_price = reservePrice;
      channel.currentAuction.currentAuctionTimer = timer;
      channel.currentAuction.currentAuctionStatus = 'running';
      channel.currentAuction.username = '';
      channel.currentAuction.userId = '';
      channel.currentAuction.salePrice = '';
      channel.currentAuction.currentMessageInfo = reservePrice
        ? 'reservePriceNotReached'
        : 'noReservePriceMessage';
      await saveChannel(channel);

      io.to(liveId).emit('currentAuctionData', channel.currentAuction);

      startTimer(liveId);
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
          log.warn(`Restarting current auction timer for channel ${channel.auctionId}`);
          startTimer(channel.auctionId);
        }
      }
    } catch (error) {
      log.error(error);
      Sentry.captureException(error);
    }
  };

  const startTimer = (liveId) => {
    if (auctionTimers.has(liveId)) return;
    let processing = false;
    const interval = setInterval(async () => {
      if (processing) return;
      processing = true;
      try {
        const currentChannel = await getChannel(liveId);
        if (!currentChannel || currentChannel.currentAuction.currentAuctionStatus !== 'running') {
          clearInterval(interval);
          auctionTimers.delete(liveId);
          return;
        }

        const result = await updateTimer(liveId);
        const channel = await getChannel(liveId);
        io.to(liveId).emit('currentAuctionData', channel.currentAuction);

        if (result[0] <= 0) {
          clearInterval(interval);
          auctionTimers.delete(liveId);
          await onAuctionFinished(liveId);
        }
      } catch (error) {
        clearInterval(interval);
        auctionTimers.delete(liveId);
        log.error(error);
        Sentry.captureException(error);
      } finally {
        processing = false;
      }
    }, 1000);
    auctionTimers.set(liveId, interval);
  };

  // No bid = no charge
  // Bid with reserve price not reached ( = or > ) = no charge
  // Bid with reached reserve price = charge
  // Bid without reserve price = charge
  const onAuctionFinished = async function (liveId) {
    try {
      const channel = await getChannel(liveId);

      if (
        channel.currentAuction.userId &&
        (!channel.currentAuction.product_reserved_price ||
          channel.currentAuction.currentProductAmount >= channel.currentAuction.product_reserved_price)
      ) {
        // Charge customer and create a Product in DB
        const saleSucceeded = await registerAuction({
          auction: channel.currentAuction,
          auctionId: channel.auctionId,
          auctionsStatus: channel.auctionsStatus,
          sellerId: channel.sellerId,
          sellerName: channel.sellerName,
        });

        if (saleSucceeded) {
          channel.currentAuction.salePrice = Number(channel.currentAuction.currentProductAmount);
        } else {
          channel.currentAuction.userId = '';
          channel.currentAuction.salePrice = 0;
        }
      } else {
        // We must reset the user ID to no-one since the last bidder didn't reach the reserved price
        channel.currentAuction.userId = '';
        log.info(`Auction finished without buyer for product ${channel.currentAuction.productName}`);
      }

      channel.currentAuction.currentAuctionStatus = 'stopping';

      // send notification to the room
      io.to(liveId).emit('currentAuctionData', channel.currentAuction);

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
    pausedCurrentAuctionStatus,
    restartAllChannelsAuctions,
    startCurrentAuction,
  };
};
