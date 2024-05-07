const { io } = require('socket.io-client');
const { DateTime } = require('luxon');
const timer = require('time-counter');

const URL = 'http://localhost:3000';
const MAX_CLIENTS = 10;
const POLLING_PERCENTAGE = 0.05;
const CLIENT_CREATION_INTERVAL_IN_MS = 10;
const EMIT_INTERVAL_IN_MS = 1000;

let clientCount = 0;
let lastReport = new Date().getTime();
let packetsSinceLastReport = 0;

let channelData = {};

const liveData = {
  seller_id: 0,
  sellerName: 'raphi',
  live_name: 'testing',
  live_description: 'selling shoes',
  live_date_time: DateTime.fromJSDate(new Date()).toISO(),
  live_status: 'coming_soon',
  business_activity: 'shows',
  imageUrl: '',
  messages: [],
};

const user = {
  firstname: 'raphi user',
  lastname: 'daguy',
  profil: 'user',
  phone: '0783945345',
  email: 'plop@plop.fr',
  password: 'idk',
  isConfirmed: true,
  registeredConfirmedCode: 0,
  stripeCustomerId: 'cust_tbd',
  hasValidPaymentMethod: true,
  shipping_address: 'chez moi',
  resetPasswordCode: 0,
  blockedUser: [],
  blockedSeller: [],
  isBanned: false,
};

const createClient = () => {
  // for demonstration purposes, some clients stay stuck in HTTP long-polling
  const transports = Math.random() < POLLING_PERCENTAGE ? ['polling'] : ['polling', 'websocket'];

  const socket = io(URL, {
    transports,
  });

  setInterval(() => {
    socket.emit('joinChannel', { liveData, user });
  }, EMIT_INTERVAL_IN_MS);

  socket.on('channelData', (channelData) => {
    channelData = channelData;
    console.log(`${channelData.channelName} : ${channelData.userCount}`);
    setInterval(() => {
      socket.emit('newLiveMessage', { user, message: { live_message: 'Hello World!' }, liveData: channelData });
    }, EMIT_INTERVAL_IN_MS);
    packetsSinceLastReport++;
  });

  socket.on('currentAuctionData', () => {
    packetsSinceLastReport++;
  });

  socket.on('disconnect', (reason) => {
    console.log(`disconnect due to ${reason}`);
  });

  if (++clientCount < MAX_CLIENTS) {
    setTimeout(createClient, CLIENT_CREATION_INTERVAL_IN_MS);
  }
};

createClient();

const printReport = () => {
  const now = new Date().getTime();
  const durationSinceLastReport = (now - lastReport) / 1000;
  const packetsPerSeconds = (packetsSinceLastReport / durationSinceLastReport).toFixed(2);

  console.log(`client count: ${clientCount} ; average packets received per second: ${packetsPerSeconds}`);

  packetsSinceLastReport = 0;
  lastReport = now;
};

setInterval(printReport, 5000);
