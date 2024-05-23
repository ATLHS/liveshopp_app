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
 * @param {Live} liveData
 * @param {*} user
 * @return {Channel}
 */
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
 * @param {*} liveData
 * @param {*} user
 * @return {Promise<Channel>}
 */
const createChannel = async (liveData, user) => {
  const newChannel = channel(liveData, user);

  return await redis.json.set(newChannel.channelName, '$', newChannel);
};

/**
 *
 * @param {*} liveData
 * @param {*} user
 * @return {Promise<Channel>}
 */
const getChannel = async (name) => {
  return await redis.json.get(name);
};

/**
 *
 * @param {*} liveData
 * @param {*} user
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

const saveChannel = async (channel) => {
  return await redis.json.set(channel.channelName, '$', channel);
};

const saveAuctionTimer = async (channel) => {
  return await redis.json.set(channel.channelName, '$.currentAuction.currentAuctionDelay', channel.currentAuction.currentAuctionDelay);
};

module.exports = { createChannel, getChannel, getChannels, saveAuctionTimer, saveChannel };
