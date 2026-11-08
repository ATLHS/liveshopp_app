jest.mock('../models/user', () => ({ findById: jest.fn() }));
jest.mock('../models/seller', () => ({ findById: jest.fn() }));
jest.mock('../models/live', () => ({ findById: jest.fn() }));
jest.mock('../utils/channels', () => ({
  updateTimer: jest.fn(), addChatMessage: jest.fn(), createChannel: jest.fn(),
  getChannel: jest.fn(), saveChannel: jest.fn(), getChannels: jest.fn(),
}));
jest.mock('../utils/notifications', () => ({ sendLiveIsStarting: jest.fn() }));
jest.mock('../utils/auctions', () => ({ registerAuction: jest.fn() }));
jest.mock('../utils/updateCustomer', () => ({ updateCustomer: jest.fn() }));

const { getChannel, saveChannel } = require('../utils/channels');
const User = require('../models/user');
const socketHandler = require('../utils/socketHandler');

const io = { to: jest.fn(() => ({ emit: jest.fn() })) };
const handler = socketHandler(io);
const liveId = 'live-1';

beforeEach(() => jest.clearAllMocks());

it('records the authenticated bidder identity rather than the submitted identity', async () => {
  const channel = {
    sellerId: 'seller-1', currentAuction: {
      currentAuctionStatus: 'running', currentAuctionTimer: 30,
      currentProductAmount: 10, product_reserved_price: 0,
    },
  };
  getChannel.mockResolvedValue(channel);
  User.findById.mockResolvedValue({
    firstname: 'Buyer', lastname: 'One', shipping_address: 'Paris', hasValidPaymentMethod: true,
  });
  const socket = {
    rooms: new Set([liveId]),
    data: { user: {
      id: 'buyer-1', profil: 'user', firstname: 'Buyer', lastname: 'One',
      shipping_address: 'Paris', hasValidPaymentMethod: true,
    } },
  };

  await handler.bid.call(socket, { liveId, data: {
    bid: 1.99, userId: 'another-user', username: 'Fake', shipping_address: 'Fake address',
  } });

  expect(channel.currentAuction).toEqual(expect.objectContaining({
    currentProductAmount: 11.99, userId: 'buyer-1', username: 'Buyer O', shipping_address: 'Paris',
  }));
  expect(saveChannel).toHaveBeenCalledWith(channel);
});

it('rejects bids from the host and from customers without payment setup', async () => {
  getChannel.mockResolvedValue({ sellerId: 'seller-1', currentAuction: { currentAuctionStatus: 'running', currentAuctionTimer: 30 } });
  const socket = { rooms: new Set([liveId]), data: { user: { id: 'seller-1', hasValidPaymentMethod: true, shipping_address: 'Paris' } } };
  await handler.bid.call(socket, { liveId, data: { bid: 100 } });
  socket.data.user.id = 'buyer-1';
  socket.data.user.hasValidPaymentMethod = false;
  User.findById.mockResolvedValue({ hasValidPaymentMethod: false, shipping_address: 'Paris' });
  await handler.bid.call(socket, { liveId, data: { bid: 100 } });
  expect(saveChannel).not.toHaveBeenCalled();
});
