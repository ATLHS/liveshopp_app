const Live = require('../models/live');
const { DateTime } = require('luxon');
const Sentry = require('@sentry/node');

const returnRefreshingLives = async (socket) => {
  const lives = await Live.find();
  const now = DateTime.now();

  // TO DO : Needs to be created as a utility function because it's repeated several times.
  // Get the next live and update it if it starts within the next 5 minutes
  lives.map(async (live) => {
    if (live.live_status === 'coming_soon' && DateTime.fromISO(live.live_date_time).minus({ minutes: 5 }) <= now) {
      live.live_status = 'live';
      await live.save();
    }
  });

  if (lives) {
    socket.emit('refreshingLives', { refreshLives });
  }
};

// const returnRefreshingSellerLives = async (socket, io, sellerId) => {
//   try {
//     let sellerLives = await Live.find({ seller_id: sellerId });
//
//     // TO DO : Needs to be created as a utility function because it's repeated several times.
//     // Get the next live and update it if it starts within the next 5 minutes
//     const now = DateTime.now();
//     sellerLives.map(async (live) => {
//       if (live.live_status === 'coming_soon' && DateTime.fromISO(live.live_date_time).minus({ minutes: 5 }) <= now) {
//         live.live_status = 'live';
//         await live.save();
//       }
//     });
//
//     if (sellerLives) {
//       socket.emit('refreshingSellerLives', sellerLives);
//     }
//   } catch (error) {
//     Sentry.captureException(error);
//     return res.sendStatus(500);
//   }
// };

module.exports = { returnRefreshingLives };
