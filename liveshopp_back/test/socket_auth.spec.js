jest.mock('../models/user', () => ({ findById: jest.fn() }));
jest.mock('../models/seller', () => ({ findById: jest.fn() }));

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Seller = require('../models/seller');
const { verifySocket } = require('../middleware/verifySocket');

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = 'test-secret';
});

it('rejects socket connections without a valid token', async () => {
  const next = jest.fn();
  await verifySocket({ handshake: { auth: {} }, data: {} }, next);
  expect(next).toHaveBeenCalledWith(expect.any(Error));

  next.mockClear();
  await verifySocket({ handshake: { auth: { token: 'invalid' } }, data: {} }, next);
  expect(next).toHaveBeenCalledWith(expect.any(Error));
  expect(User.findById).not.toHaveBeenCalled();
});

it('uses the database identity and rejects banned customers', async () => {
  const token = jwt.sign({ id: 'user-1' }, process.env.JWT_SECRET);
  const socket = { handshake: { auth: { token } }, data: {} };
  const next = jest.fn();
  User.findById.mockResolvedValueOnce({ id: 'user-1', profil: 'user', isBanned: true });
  await verifySocket(socket, next);
  expect(next).toHaveBeenCalledWith(expect.any(Error));

  next.mockClear();
  User.findById.mockResolvedValueOnce({
    id: 'user-1', profil: 'user', firstname: 'A', lastname: 'B',
    shipping_address: 'Paris', hasValidPaymentMethod: true, isBanned: false,
  });
  await verifySocket(socket, next);
  expect(next).toHaveBeenCalledWith();
  expect(socket.data.user).toEqual(expect.objectContaining({ id: 'user-1', shipping_address: 'Paris' }));
  expect(Seller.findById).not.toHaveBeenCalled();
});
