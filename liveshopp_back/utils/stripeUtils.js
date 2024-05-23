const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);
const Sentry = require('@sentry/node');

const createCustomer = async (customerData) => {
  try {
    return await stripe.customers.create({
      name: customerData.company_name || customerData.firstname,
      email: customerData.email,
      phone: customerData.phone || '',
    });
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
};

const retrieveCustomer = async (id) => {
  try {
    return await stripe.customers.retrieve(id);
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
};

const chargeCustomer = async (amountToCharge, customerId, paymentIntentMetadata) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountToCharge,
      currency: 'eur',
      customer: customerId,
      payment_method: paymentMethods.data[0].id,
      off_session: true,
      confirm: true,
      metadata: paymentIntentMetadata,
    });

    return paymentIntent;
  } catch (error) {
    Sentry.captureException(error);
    throw new Error(err.message);
  }
};

const deleteCustomer = async (id) => {
  try {
    return await stripe.customers.del(id).deleted;
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
};

module.exports = { chargeCustomer, createCustomer, deleteCustomer, retrieveCustomer };
