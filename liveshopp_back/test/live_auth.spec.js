jest.mock('../models/user', () => ({ findById: jest.fn() }));
jest.mock('../models/seller', () => ({ findById: jest.fn() }));
jest.mock('../models/live', () => {
  const Live = jest.fn();
  Live.find = jest.fn();
  Live.findById = jest.fn();
  Live.findOneAndDelete = jest.fn();
  Live.findOneAndUpdate = jest.fn();
  return Live;
});
jest.mock('../models/product', () => ({ updateMany: jest.fn() }));
jest.mock('../utils/emitFreshLives', () => ({ emitFreshLives: jest.fn() }));
jest.mock('../utils/generateAgoraToken', () => ({ generateAgoraChannelToken: jest.fn() }));

const User = require('../models/user');
const Seller = require('../models/seller');
const Live = require('../models/live');
const Product = require('../models/product');
const { generateAgoraChannelToken } = require('../utils/generateAgoraToken');
const router = require('../routes/api/live');

const route = (path) => router.stack.find((layer) => layer.route?.path === path).route.stack.at(-1).handle;
const response = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });

beforeEach(() => jest.clearAllMocks());

it('does not delete another seller’s live from a forged request body', async () => {
  Live.findOneAndDelete.mockResolvedValue(null);
  const req = { user: { id: 'seller-1' }, body: { data: { _id: 'live-1', seller_id: 'seller-2' } }, t: (key) => key };
  const res = response();

  await route('/delete-live')(req, res);

  expect(Live.findOneAndDelete).toHaveBeenCalledWith({
    _id: 'live-1', seller_id: 'seller-1', live_status: 'coming_soon',
  });
  expect(res.status).toHaveBeenCalledWith(404);
});

it('does not close products when the caller does not own the live', async () => {
  Live.findOneAndUpdate.mockResolvedValue(null);
  const req = { user: { id: 'seller-1' }, body: { data: { _id: 'live-1', seller_id: 'seller-2' } }, t: (key) => key };
  const res = response();

  await route('/close-live')(req, res);

  expect(Live.findOneAndUpdate).toHaveBeenCalledWith(
    { _id: 'live-1', seller_id: 'seller-1', live_status: { $in: ['coming_soon', 'live'] } },
    { live_status: 'ended' },
  );
  expect(Product.updateMany).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(404);
});

it('issues a viewer token to a seller watching another seller’s live', async () => {
  User.findById.mockResolvedValue(null);
  Seller.findById.mockResolvedValue({ profil: 'seller' });
  Live.findById.mockResolvedValue({ seller_id: 'seller-2', live_status: 'live' });
  generateAgoraChannelToken.mockResolvedValue({ token: 'viewer-token' });
  const req = { user: { id: 'seller-1' }, body: { data: { liveId: 'live-1' } }, t: (key) => key };
  const res = response();

  await route('/get-agora-token')(req, res);

  expect(generateAgoraChannelToken).toHaveBeenCalledWith('user', 'live-1', expect.any(String));
  expect(res.status).toHaveBeenCalledWith(200);
});

it('rejects a new live that starts before and overlaps an existing live', async () => {
  Seller.findById.mockResolvedValue({ company_name: 'Seller' });
  Live.find.mockReturnValue({ exec: async () => [{ live_date_time: '2026-11-06T10:00:00.000Z' }] });
  const req = {
    user: { id: 'seller-1' },
    body: { data: {
      live_name: 'New live', live_description: '', live_date_time: '2026-11-06T09:30:00.000Z',
    } },
    t: (key) => key,
  };
  const res = response();

  await route('/create-live')(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(Live).not.toHaveBeenCalled();
});

it('returns the newly created live in the seller list', async () => {
  Seller.findById.mockResolvedValue({ company_name: 'Seller' });
  Live.mockImplementation(() => ({ save: jest.fn() }));
  Live.find
    .mockReturnValueOnce({ exec: async () => [] })
    .mockReturnValueOnce({ exec: async () => [{ _id: 'new-live' }] })
    .mockReturnValueOnce({ exec: async () => [{ _id: 'new-live' }] });
  const req = {
    user: { id: 'seller-1' },
    body: { data: {
      live_name: 'New live', live_description: '', live_date_time: '2026-11-06T09:30:00.000Z',
    } },
    t: (key) => key,
  };
  const res = response();

  await route('/create-live')(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ sellerLives: [{ _id: 'new-live' }] }));
});
