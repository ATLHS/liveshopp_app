// @ts-check
const { redis } = require('./services');

/**
 * @typedef {Object} Channel
 * @property {string} channelName
 * @property {string} sellerId
 * @property {string} sellerName
 * @property {string} auctionId
 * @property {('live'|'ended'|'coming_soon')} auctionsStatus
 * @property {string} liveSchedule
 * @property {string} pinnedMessage
 * @property {Number} userCount
 * @property {Number} extraUserCount
 * @property {Array} messages
 * @property {boolean} hostIsLive
 * @property {boolean} notificationSent
 * @property {CurrentAuction} currentAuction
 */

/**
 * @typedef {Object} CurrentAuction
 * @property {string} userId
 * @property {string} username
 * @property {string} productName
 * @property {number} currentProductAmount
 * @property {number} product_reserved_price
 * @property {number} currentAuctionTimer
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
 * @property {string} pinned_message
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
  auctionId: live._id.toString(),
  auctionsStatus: live.live_status,
  liveSchedule: live.live_date_time,
  pinnedMessage: live.pinned_message,
  userCount: 0,
  extraUserCount: 0,
  messages: [],
  hostIsLive: false,
  notificationSent: false,
  currentAuction: {
    userId: '',
    username: '',
    productName: '',
    currentProductAmount: 0,
    product_reserved_price: 0,
    currentAuctionTimer: 0,
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

  const res = await redis.json.set(newChannel.auctionId, '$', newChannel);
  if (res === 'OK') {
    return await getChannel(newChannel.auctionId);
  }
  return null;
};

/**
 * @param {string} id Live ID
 * @return {Promise<Channel>}
 */
const getChannel = async (id) => {
  return await redis.json.get(id);
};

/**
 * @return {Promise<Array.<Channel>>}
 */
const getChannels = async () => {
  const channels = [];
  const keys = await redis.keys('*');

  if (keys.length) {
    const results = await redis.json.mGet(keys, '$');

    for (const result of results) {
      channels.push(result[0]);
    }
  }

  return channels;
};

/**
 * @param {Channel} channel
 */
const saveChannel = async (channel) => {
  return await redis.json.set(channel.auctionId, '$', channel);
};

/**
 * @param {string} id Live ID
 * @param {Object} message
 */
const addChatMessage = async (id, message) => {
  return await redis.json.arrAppend(id, '$.messages', message);
};

/**
 * @param {string} id Live ID
 */
const updateTimer = async (id) => {
  return await redis.json.NUMINCRBY(id, '$.currentAuction.currentAuctionTimer', -1);
};

/**
 * @param {string} id Live ID
 */
const updateExtraUserCount = async (id, count) => {
  return await redis.json.NUMINCRBY(id, '$.extraUserCount', count);
};

module.exports = {
  addChatMessage,
  createChannel,
  getChannel,
  getChannels,
  updateExtraUserCount,
  updateTimer,
  saveChannel,
};
