jest.mock('../models/auction_videos_items', () => ({ find: jest.fn() }));
jest.mock('../models/auction_video', () => ({ find: jest.fn() }));
jest.mock('../models/product', () => jest.fn());
jest.mock('../utils/stripeUtils', () => ({ chargeCustomer: jest.fn() }));
jest.mock('../utils/emails', () => ({
  sendNoBidNotificationEmail: jest.fn(),
  sendNoShippingAddressEmail: jest.fn(),
  sendWinningBidConfirmationEmail: jest.fn(),
  sendAuctionSaleNotificationEmail: jest.fn(),
  sendBidOutbidEmailNotification: jest.fn(),
  sendPaymentIssueEmail: jest.fn(),
  sendBidRejectedDueToLowReservePrice: jest.fn(),
}));

const handleAuctionVideos = require('../utils/auctionVideosHandler');
const VideosItem = require('../models/auction_videos_items');
const AuctionVideoItem = require('../models/auction_video');
const Product = require('../models/product');
const stripeUtils = require('../utils/stripeUtils');
const emails = require('../utils/emails');

const mockAuctions = (items, bids) => {
  VideosItem.find.mockReturnValue({ populate: () => ({ exec: async () => items }) });
  AuctionVideoItem.find.mockReturnValue({ sort: () => ({ populate: async () => bids }) });
};

beforeEach(() => jest.clearAllMocks());

it('closes an expired video auction without bids', async () => {
  const item = { _id: 'auction-1', save: jest.fn() };
  mockAuctions([item], []);

  await handleAuctionVideos('auction-1', {});

  expect(VideosItem.find).toHaveBeenCalledWith({
    _id: 'auction-1',
    auctionStatus: 'onGoing',
    auctionEndDate: { $lte: expect.any(Date) },
  });
  expect(item.auctionStatus).toBe('closed');
  expect(item.save).toHaveBeenCalledTimes(1);
  expect(emails.sendNoBidNotificationEmail).toHaveBeenCalledWith(item, {});
  expect(stripeUtils.chargeCustomer).not.toHaveBeenCalled();
});

it('charges the winner in cents and records the video sale', async () => {
  const item = {
    _id: 'auction-2', seller_id: { _id: 'seller-1' }, sellerName: 'Seller',
    productName: 'Product', reservePrice: 10, save: jest.fn(),
  };
  const customer = { _id: 'buyer-1', email: 'buyer@example.com', firstname: 'Buyer', shipping_address: 'Paris' };
  const bid = { userId: customer, docModel: 'User', amount: 19.99 };
  mockAuctions([item], [bid]);
  stripeUtils.chargeCustomer.mockResolvedValue({ status: 'succeeded' });
  const save = jest.fn();
  Product.mockImplementation(() => ({ save }));

  await handleAuctionVideos('auction-2', {});

  expect(stripeUtils.chargeCustomer).toHaveBeenCalledWith(1999, customer, expect.objectContaining({
    seller_id: 'seller-1', amount: 19.99,
  }));
  expect(Product).toHaveBeenCalledWith(expect.objectContaining({ userId: 'buyer-1', userType: 'User' }));
  expect(save).toHaveBeenCalledTimes(1);
  expect(item.auctionStatus).toBe('sold');
  expect(item.save).toHaveBeenCalledTimes(1);
  expect(emails.sendWinningBidConfirmationEmail).toHaveBeenCalledWith(bid, {});
});
