// @ts-check
const timer = require('time-counter');
const { redis } = require('./services');

/**
 * @typedef {Object} Channel
 * @property {string} channelName
 * @property {string} sellerId
 * @property {string} sellerName
 * @property {string} auctionId
 * @property {('live'|'ended'|'coming_soon')} auctionsStatus
 * @property {string} liveSchedule
 * @property {Number} userCount
 * @property {Array} messages
 * @property {boolean} hostIsLive
 * @property {CurrentAuction} currentAuction
 */

/**
 * @typedef {Object} CurrentAuction
 * @property {string} userId
 * @property {string} username
 * @property {string} productName
 * @property {number} currentProductAmount
 * @property {number} product_reserved_price
 * @property {timer} currentAuctionDelay
 * @property {('paused'|'ended'|'running'|'stopping')} currentAuctionStatus
 * @property {number} salePrice
 * @property {string} currentMessageInfo
 */

/**
 * @typedef {Object} Live
 * @property {string} seller_id
 * @property {string} sellerName
 * @property {string} live_name
 * @property {string} live_description
 * @property {string} live_date_time
 * @property {('coming_soon'|'ended')} live_status
 * @property {string} business_activity
 * @property {string} imageUrl
 */

/**
 *
 * @param {Live} live
 * @return {Channel}
 */
const channel = (live) => ({
  channelName: live.live_name,
  sellerId: live.seller_id,
  sellerName: live.sellerName,
  auctionId: live._id,
  auctionsStatus: live.live_status,
  liveSchedule: live.live_date_time,
  userCount: 0,
  messages: [],
  hostIsLive: false,
  currentAuction: {
    userId: '',
    username: '',
    productName: '',
    currentProductAmount: 0,
    product_reserved_price: 0,
    currentAuctionDelay: new timer(),
    currentAuctionStatus: 'paused',
    salePrice: 0,
    currentMessageInfo: '',
  },
});

/**
 * @async
 * @param {Live} live
 * @return {Promise<Channel>}
 */
const createChannel = async (live) => {
  const newChannel = channel(live);

  const res = await redis.json.set(newChannel.channelName, '$', newChannel);
  if (res === 'OK') {
    return await getChannel(newChannel.channelName);
  }
  return null;
};

/**
 * @param {string} name
 * @return {Promise<Channel>}
 */
const getChannel = async (name) => {
  return await redis.json.get(name);
};

/**
 * @return {Promise<Array.<Channel>>}
 */
const getChannels = async () => {
  const keys = await redis.keys('*');
  const results = await redis.json.mGet(keys, '$');
  const channels = [];

  for (const result of results) {
    channels.push(result[0]);
  }
  return channels;
};

/**
 * @param {Channel} channel
 */
const saveChannel = async (channel) => {
  return await redis.json.set(channel.channelName, '$', channel);
};

const saveAuctionTimer = async (channel) => {
  return await redis.json.set(channel.channelName, '$.currentAuction.currentAuctionDelay', channel.currentAuction.currentAuctionDelay);
};

module.exports = { createChannel, getChannel, getChannels, saveAuctionTimer, saveChannel };
