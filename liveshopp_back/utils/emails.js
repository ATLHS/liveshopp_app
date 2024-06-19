const Sentry = require('@sentry/node');
const { log } = require('../middleware/logger');
const { mailer } = require('./services');

const sendCodeToConfirmEmailRegistration = async (userEmail, code, req) => {
  const template = req.t('confirmationEmailBody', { code });

  await sendEmail(userEmail, req.t('confirmationCode'), template);
};

const sendCodeToResetPassword = async (userEmail, code, req) => {
  const template = req.t('verificationEmail', { code });

  await sendEmail(userEmail, req.t('verificationCode'), template);
};

const sendWelcomeEmail = async (customer, req) => {
  const template = req.t('welcomeEmail', { firstname: customer.firstname });

  await sendEmail(customer.email, req.t('welcomeMessage'), template);
};

const sendNoBidNotificationEmail = async (auctionItem, req) => {
  const template = req.t('auctionNotification', {
    company_name: auctionItem.seller_id.company_name,
    product_name: auctionItem.productName,
  });

  await sendEmail(auctionItem.seller_id.email, req.t('noBidsThisTime'), template);
};

const sendNoReservePriceReachedNotificationEmail = async (customer, product, req) => {
  const template = req.t('auctionEndNotification', {
    company_name: customer.company_name,
    product_name: product.productName,
  });

  await sendEmail(customer.email, req.t('noReservePriceBids'), template);
};

const sendEmailAfterBid = async (customer, product, req) => {
  const template = req.t('bidConfirmation', {
    firstname: customer.firstname,
    current_price: product.currentPricee,
    product_name: product.productName,
  });

  await sendEmail(customer.email, req.t('bidAcknowledged'), template);
};

const sendEmailToInformOutbid = async (customer, product, req) => {
  const template = req.t('outbidNotification', {
    firstname: customer.firstname,
    product_name: product.productName,
  });

  await sendEmail(customer.email, req.t('outbidMessage'), template);
};

const sendBidRejectedDueToLowReservePrice = async (auction, req) => {
  const template = req.t('bidNotAccepted', {
    firstname: auction.userId.firstname,
    product_name: auction.auctionItemId.productName,
  });

  await sendEmail(auction.userId.email, req.t('bidDidNotMakeIt'), template);
};

const sendPaymentIssueEmail = async (auction, req) => {
  const template = req.t('paymentIssue', {
    firstname: auction.userId.firstname,
    product_name: auction.auctionItemId.productName,
  });

  await sendEmail(auction.userId.email, req.t('bidAlertMessage'), template);
};

const sendWinningBidConfirmationEmail = async (auction, req) => {
  const template = req.t('congratulations', {
    firstname: auction.userId.firstname,
    product_name: auction.auctionItemId.productName,
  });

  await sendEmail(auction.userId.email, req.t('wonAuctionMessage'), template);
};

const sendAuctionSaleNotificationEmail = async (auctionItem, auction, req) => {
  const template = req.t('auctionSoldNotification', {
    seller_name: auction.auctionItemId.sellerName,
    product_name: auction.auctionItemId.productName,
  });

  await sendEmail(auctionItem.seller_id.email, req.t('itemSoldMessage'), template);
};

const sendNoShippingAddressEmail = async (auction, req) => {
  const template = req.t('auctionBidCancelled', {
    firstname: auction.userId.firstname,
    product_name: auction.auctionItemId.productName,
  });

  await sendEmail(auction.userId.email, req.t('auctionCancelledMessage'), template);
};

const sendBidOutbidEmailNotification = async (email, auction, req) => {
  const template = req.t('auctionEndedNotification', {
    firstname: auction.userId.firstname,
    product_name: auction.auctionItemId.productName,
  });

  await sendEmail(auction.userId.email, req.t('auctionEndedMessage'), template);
};

const sendEmail = async (email, subject, html) => {
  try {
    return await mailer.sendMail({
      from: '"Liveshopp" <application@liveshopp.fr>',
      to: email,
      subject,
      html,
    });
  } catch (error) {
    log.error('Email error:');
    log.error(error);
    Sentry.captureException(error);
  }
};

module.exports = {
  sendAuctionSaleNotificationEmail,
  sendCodeToConfirmEmailRegistration,
  sendCodeToResetPassword,
  sendWelcomeEmail,
  sendNoShippingAddressEmail,
  sendBidOutbidEmailNotification,
  sendPaymentIssueEmail,
  sendWinningBidConfirmationEmail,
  sendBidRejectedDueToLowReservePrice,
  sendEmailAfterBid,
  sendNoReservePriceReachedNotificationEmail,
  sendEmailToInformOutbid,
  sendNoBidNotificationEmail,
};
