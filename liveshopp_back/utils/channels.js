const timer = require('time-counter');
const { redis } = require('./services');

const channel = (liveData, user) => ({
  channelName: liveData.live_name,
  sellerId: liveData.seller_id,
  sellerName: liveData.sellerName,
  auctionId: liveData._id,
  auctionsStatus: liveData.live_status,
  liveSchedule: liveData.live_date_time,
  userCount: 1,
  messages: [],
  hostIsLive: user.profil === 'seller' && user.id === liveData.seller_id,
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
  },
});

const createChannel = async (liveData, user) => {
  const newChannel = channel(liveData, user);

  return await redis.json.set(newChannel.channelName, '$', newChannel);
};

const getChannel = async (name) => {
  return await redis.json.get(name);
};

const getChannels = async () => {
  const keys = await redis.keys('*');
  const results = await redis.json.mGet(keys, '$');
  const channels = [];

  for (const result of results) {
    channels.push(result[0]);
  }
  return channels;
};

const saveChannel = async (channel) => {
  return await redis.json.set(channel.channelName, '$', channel);
};

const saveAuctionTimer = async (channel) => {
  return await redis.json.set(channel.channelName, '$.currentAuction.currentAuctionDelay', channel.currentAuction.currentAuctionDelay);
};

module.exports = { createChannel, getChannel, getChannels, saveAuctionTimer, saveChannel };
