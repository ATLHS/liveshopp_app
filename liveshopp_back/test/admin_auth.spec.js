jest.mock('../models/user', () => ({ findById: jest.fn() }));
jest.mock('../models/seller', () => ({ findById: jest.fn() }));

const User = require('../models/user');
const Seller = require('../models/seller');
const { requireAdmin } = require('../middleware/requireAdmin');

const response = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });

beforeEach(() => jest.clearAllMocks());

it('rejects a regular authenticated customer', async () => {
  User.findById.mockResolvedValue({ profil: 'user', isBanned: false });
  const res = response();
  const next = jest.fn();

  await requireAdmin({ user: { id: 'user-1' } }, res, next);

  expect(res.status).toHaveBeenCalledWith(403);
  expect(next).not.toHaveBeenCalled();
});

it('accepts only an active administrator from the database', async () => {
  User.findById.mockResolvedValue(null);
  Seller.findById.mockResolvedValue({ profil: 'admin', isBanned: false });
  const res = response();
  const next = jest.fn();

  await requireAdmin({ user: { id: 'admin-1' } }, res, next);

  expect(next).toHaveBeenCalledTimes(1);
  expect(res.status).not.toHaveBeenCalled();
});
