jest.mock('../models/user', () => ({ findById: jest.fn() }));
jest.mock('../models/seller', () => ({ findById: jest.fn() }));

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Seller = require('../models/seller');
const { verifyJwt } = require('../middleware/verifyJwt');

const response = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = 'test-secret';
});

it('rejects missing and invalid bearer tokens', async () => {
  const res = response();
  const next = jest.fn();
  await verifyJwt({ headers: {} }, res, next);
  expect(res.status).toHaveBeenCalledWith(401);

  res.status.mockClear();
  await verifyJwt({ headers: { authorization: 'Bearer invalid' } }, res, next);
  expect(res.status).toHaveBeenCalledWith(401);
  expect(next).not.toHaveBeenCalled();
});

it('rejects a banned account even with a valid token', async () => {
  const token = jwt.sign({ id: 'user-1' }, process.env.JWT_SECRET);
  User.findById.mockResolvedValue({ id: 'user-1', isBanned: true });
  const res = response();
  const next = jest.fn();

  await verifyJwt({ headers: { authorization: `Bearer ${token}` } }, res, next);

  expect(res.status).toHaveBeenCalledWith(403);
  expect(next).not.toHaveBeenCalled();
});

it('passes a trusted database identity to the next handler', async () => {
  const token = jwt.sign({ id: 'user-1', email: 'spoofed@example.com' }, process.env.JWT_SECRET);
  User.findById.mockResolvedValue(null);
  Seller.findById.mockResolvedValue({ id: 'user-1', email: 'actual@example.com', isBanned: false });
  const req = { headers: { authorization: `Bearer ${token}` } };
  const next = jest.fn();

  await verifyJwt(req, response(), next);

  expect(req.user).toEqual({ id: 'user-1', email: 'actual@example.com' });
  expect(next).toHaveBeenCalledTimes(1);
});
