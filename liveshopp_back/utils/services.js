const { log } = require('../middleware/logger');
const { mongoose } = require('mongoose');
const nodemailer = require('nodemailer');
const { createClient } = require('redis');
const firebaseAdmin = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const { S3Client } = require('@aws-sdk/client-s3');
const { Stripe } = require('stripe');

// Register service helper
// Stores instances in `global` to prevent memory leaks in development
const registerService = (name, initFn) => {
  if (process.env.NODE_ENV === 'development') {
    if (!(name in global)) {
      global[name] = initFn();
    }
    return global[name];
  }
  return initFn();
};

/**
 * @type {import('mongoose')}
 */
registerService('mongoose', () => {
  mongoose
    .connect(process.env.ATLAS_URL)
    .then(() => log.info(`Mongoose connected successfully`))
    .catch((err) => log.error('Mongoose Error', err));
});

/**
 * @type {import('redis').RedisClientType}
 */
const redis = registerService('redis', () => {
  const client = createClient({
    url: process.env.REDIS_URL,
    connectTimeout: 10000, // in milliseconds
    password: process.env.NODE_ENV === 'production' ? process.env.REDIS_AUTH_TOKEN : null,
  })
    .on('error', (err) => log.error('Redis Client Error', err))
    .on('connect', () => log.info('Redis connected successfully'));

  client.connect();

  return client;
});

/**
 * @type {import('nodemailer').Transporter}
 */
const mailer = registerService('mailer', () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    tls: {
      ciphers: 'SSLv3',
    },
    from: process.env.LIVESHOPP_EMAIL,
    secureConnection: true,
    auth: {
      user: process.env.LIVESHOPP_EMAIL, // generated ethereal user
      pass: process.env.LIVESHOPP_EMAIL_PASSWORD, // generated ethereal password
    },
  });
});

/**
 * @type {import('@aws-sdk/client-s3').S3Client}
 */
const s3 = registerService('s3', () => {
  return new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
});

/**
 * @type {import('stripe').Stripe}
 */
const stripe = registerService('stripe', () => {
  return new Stripe(process.env.STRIPE_SECRET_KEY);
});

/**
 * @type {import('firebase-admin/messaging').Messaging}
 */
const firebase = registerService('firebase', () => {
  firebaseAdmin.initializeApp({ credential: firebaseAdmin.applicationDefault() });
  return getMessaging();
});

module.exports = { firebase, mailer, redis, s3, stripe };
