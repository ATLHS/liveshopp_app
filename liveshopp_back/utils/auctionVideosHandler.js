const { log } = require('../middleware/logger');
const VideosItem = require('../models/auction_videos_items');
const AuctionVideoItem = require('../models/auction_video');
const {
  sendNoBidNotificationEmail,
  sendNoShippingAddressEmail,
  sendWinningBidConfirmationEmail,
  sendAuctionSaleNotificationEmail,
  sendBidOutbidEmailNotification,
  sendPaymentIssueEmail,
  sendBidRejectedDueToLowReservePrice,
} = require('./emails');
const stripeUtils = require('../utils/stripeUtils');
const Product = require('../models/product');

const handleAuctionVideos = async (endingAuctionId, req) => {
  try {
    const expiredAuctions = await VideosItem.find({
      _id: endingAuctionId,
    })
      .populate('seller_id')
      .exec();

    for (const auctionItem of expiredAuctions) {
      const auctionsItems = await AuctionVideoItem.find({
        auctionItemId: auctionItem._id,
        auctionItemStatus: 'onGoing',
      })
        .sort({ amount: -1 })
        .populate([
          {
            path: 'userId',
          },
          {
            path: 'auctionItemId',
          },
        ]);

      if (auctionsItems.length === 0) {
        await handleNoBidsPlaced(auctionItem, req);
        continue;
      }

      const totalItems = auctionsItems.length;
      let currentItemIndex = 0;

      for (const auction of auctionsItems) {
        currentItemIndex++;

        const customer = auction.userId;

        if (!customer.shipping_address) {
          await handleNoShippingAddress(auctionItem, auction, currentItemIndex, totalItems, req);
          continue;
        }

        if (auction.amount >= auctionItem.reservePrice) {
          try {
            await handleSuccessfulPayment(auctionItem, auction, auctionsItems, req);
            break;
          } catch (error) {
            await handlePaymentError(auctionItem, auction, currentItemIndex, totalItems, error, req);
          }
        } else {
          await handleBidRejected(auctionItem, auction, currentItemIndex, totalItems);
        }
      }
    }
  } catch (error) {
    log.error('Error handling expired auctions:');
    log.error(error);
  }
};

let treatedUserEmailsWithError = [];

const handleNoBidsPlaced = async (auctionItem, req) => {
  auctionItem.auctionStatus = 'closed';
  await auctionItem.save();
  await sendNoBidNotificationEmail(auctionItem, req);
  treatedUserEmailsWithError = [];
  log.info(`No bids placed on item ${auctionItem._id}`);
};

const isTheLastBidWithError = async (auctionItem, auction, currentItemIndex, totalItems, req) => {
  if (currentItemIndex === totalItems) {
    // For now, keep it simple: Send a generic email to the seller notifying them that no bids were placed on their item, without detailing the user's error.
    await handleNoBidsPlaced(auctionItem, req);
  } else {
    treatedUserEmailsWithError.push(auction.userId.email);
  }
};

const handleNoShippingAddress = async (auctionItem, auction, currentItemIndex, totalItems, req) => {
  await isTheLastBidWithError(auctionItem, auction, currentItemIndex, totalItems, req);
  await sendNoShippingAddressEmail(auction, req);
  log.info(`User id : ${auction.userId._id} has no shipping address specified.`);
};

const handleSuccessfulPayment = async (auctionItem, auction, auctionsItems, req) => {
  const paymentIntentMetadata = {
    seller_id: auctionItem.seller_id._id,
    seller_name: auctionItem.sellerName,
    amount: auction.amount,
  };
  const amountToCharge = auction.amount * 100;

  // FIXME
  // stripeUtils.chargeCustomer() signature changed
  //
  // const chargedCustomer = await stripeUtils.chargeCustomer(
  //   amountToCharge,
  //   auction.userId.stripeCustomerId,
  //   paymentIntentMetadata,
  // );

  if (chargedCustomer && chargedCustomer.status === 'succeeded') {
    auctionItem.auctionStatus = 'sold';
    auctionItem.finalSalePrice = auction.amount;
    auctionItem.deliveryStatus = 'pending';
    auctionItem.shipping_address = auction.userId.shipping_address;
    auctionItem.winningBidderId = auction.userId._id;
    auctionItem.winningBidderUsername = auction.userId.firstname;

    const product = new Product({
      seller_id: auctionItem.seller_id._id,
      live_name: 'Vidéo enchères',
      auctionId: auctionItem._id,
      auctionsStatus: 'ended',
      userId: auction.userId._id,
      // TO DO : add docModel
      productName: auctionItem.productName,
      salePrice: auction.amount,
      shipping_address: auction.userId.shipping_address,
    });
    // save in db the purchased product
    await product.save();

    await auctionItem.save();
    await sendWinningBidConfirmationEmail(auction, req);
    await sendAuctionSaleNotificationEmail(auctionItem, auction, req);

    // Send an email to inform all other users that they have lost the auction.
    const userEmails = auctionsItems
      .filter(
        (item) => item.userId.email !== auction.userId.email && !treatedUserEmailsWithError.includes(item.userId.email),
      )
      .map((item) => item.userId.email);

    if (userEmails) {
      for (const email of userEmails) {
        await sendBidOutbidEmailNotification(email, auction, req);
      }
    }

    log.info(`Payment successful for user id : ${auction.userId._id}`);
  }
};

const handlePaymentError = async (auctionItem, auction, currentItemIndex, totalItems, error, req) => {
  await isTheLastBidWithError(auctionItem, auction, currentItemIndex, totalItems, req);
  await sendPaymentIssueEmail(auction, req);
  log.error(`Payment error for user id : ${auction.userId._id} ${error}`);
};

const handleBidRejected = async (auctionItem, auction, currentItemIndex, totalItems, req) => {
  await isTheLastBidWithError(auctionItem, auction, currentItemIndex, totalItems, req);
  // Send to every bidder
  await sendBidRejectedDueToLowReservePrice(auction, req);
  log.error(`User's bid : ${auction._id} for user id : ${auction.userId._id} is lower than reserve price`);
};

module.exports = handleAuctionVideos;
