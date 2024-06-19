const Sentry = require('@sentry/node');
const { log } = require('../middleware/logger');
const { mailer } = require('./services');
const i18next = require('i18next');

const sendCodeToConfirmEmailRegistration = async (userEmail, code) => {
  const template = i18next.t('confirmationEmailBody', { code });

  await sendEmail(userEmail, i18next.t('confirmationCode'), template);
};

const sendCodeToResetPassword = async (userEmail, code) => {
  const template = i18next.t('verificationEmail', { code });

  await sendEmail(userEmail, i18next.t('verificationCode'), template);
};

const sendWelcomeEmail = async (customer) => {
  const template = i18next.t('welcomeEmail', { firstname: customer.firstname });

  await sendEmail(customer.email, i18next.t('welcomeMessage'), template);
};

const sendNoBidNotificationEmail = async (auctionItem) => {
  const template = i18next.t('auctionNotification', {
    company_name: auctionItem.seller_id.company_name,
    product_name: auctionItem.productName,
  });

  await sendEmail(auctionItem.seller_id.email, i18next.t('noBidsThisTime'), template);
};

const sendNoReservePriceReachedNotificationEmail = async (customer, product) => {
  const template = i18next.t('auctionEndNotification', {
    company_name: customer.company_name,
    product_name: product.productName,
  });

  await sendEmail(customer.email, i18next.t('noReservePriceBids'), template);
};

const sendEmailAfterBid = async (customer, product) => {
  const template = i18next.t('bidConfirmation', {
    firstname: customer.firstname,
    current_price: product.currentPricee,
    product_name: product.productName,
  });

  await sendEmail(customer.email, i18next.t('bidAcknowledged'), template);
};

const sendEmailToInformOutbid = async (customer, product) => {
  const template = i18next.t('outbidNotification', {
    firstname: customer.firstname,
    product_name: product.productName,
  });

  await sendEmail(customer.email, i18next.t('outbidMessage'), template);
};

const sendBidRejectedDueToLowReservePrice = async (auction) => {
  const template = i18next.t('bidNotAccepted', {
    firstname: auction.userId.firstname,
    product_name: auction.auctionItemId.productName,
  });

  await sendEmail(auction.userId.email, i18next.t('bidDidNotMakeIt'), template);
};

const sendPaymentIssueEmail = async (auction) => {
  const template = i18next.t('paymentIssue', {
    firstname: auction.userId.firstname,
    product_name: auction.auctionItemId.productName,
  });

  await sendEmail(auction.userId.email, i18next.t('bidAlertMessage'), template);
};

const sendWinningBidConfirmationEmail = async (auction) => {
  const template = i18next.t('congratulations', {
    firstname: auction.userId.firstname,
    product_name: auction.auctionItemId.productName,
  });

  await sendEmail(auction.userId.email, i18next.t('wonAuctionMessage'), template);
};

const sendAuctionSaleNotificationEmail = async (auctionItem, auction) => {
  const template = i18next.t('auctionSoldNotification', {
    seller_name: auction.auctionItemId.sellerName,
    product_name: auction.auctionItemId.productName,
  });

  await sendEmail(auctionItem.seller_id.email, i18next.t('itemSoldMessage'), template);
};

const sendNoShippingAddressEmail = async (auction) => {
  const template = i18next.t('auctionBidCancelled', {
    firstname: auction.userId.firstname,
    product_name: auction.auctionItemId.productName,
  });

  await sendEmail(auction.userId.email, i18next.t('auctionCancelledMessage'), template);
};

const sendBidOutbidEmailNotification = async (email, auction) => {
  const template = i18next.t('auctionEndedNotification', {
    firstname: auction.userId.firstname,
    product_name: auction.auctionItemId.productName,
  });

  await sendEmail(auction.userId.email, i18next.t('auctionEndedMessage'), template);
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
