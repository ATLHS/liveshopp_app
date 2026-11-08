jest.mock('../models/product', () => ({ findOneAndUpdate: jest.fn() }));

const Product = require('../models/product');
const router = require('../routes/api/order');

const updateOrder = router.stack.find((layer) => layer.route?.path === '/update-order-status').route.stack.at(-1).handle;

const response = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });

beforeEach(() => jest.clearAllMocks());

it('only marks the authenticated seller’s pending order as shipped', async () => {
  const order = { productName: 'Product' };
  Product.findOneAndUpdate.mockReturnValue({ populate: async () => order });
  const req = {
    user: { id: 'seller-1' },
    body: { data: { selectedOrder: { _id: 'order-1' }, trackingUrl: '  https://tracking.example/1  ' } },
    t: (key) => key,
  };
  const res = response();

  await updateOrder(req, res);

  expect(Product.findOneAndUpdate).toHaveBeenCalledWith(
    { _id: 'order-1', seller_id: 'seller-1', deliveryStatut: 'pending' },
    { deliveryStatut: 'shipped', trackingUrl: 'https://tracking.example/1' },
    { new: true, runValidators: true },
  );
  expect(res.status).toHaveBeenCalledWith(200);
});

it('rejects a missing tracking URL before updating the order', async () => {
  const req = { user: { id: 'seller-1' }, body: { data: { selectedOrder: { _id: 'order-1' } } }, t: (key) => key };
  const res = response();

  await updateOrder(req, res);

  expect(Product.findOneAndUpdate).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(400);
});
