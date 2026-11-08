const { stripe } = require('./services');
const Sentry = require('@sentry/node');
const { log } = require('../middleware/logger');

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
    throw error;
  }
};

const chargeCustomer = async (amountToCharge, customer, paymentIntentMetadata) => {
  try {
    if (process.env.DISABLE_STRIPE_CHARGE === 'true') {
      log.info('DISABLE_STRIPE_CHARGE enabled: skipping Stripe charge');
      return { status: 'succeeded' };
    }

    if (process.env.DISABLE_STRIPE_CHARGE_FOR_USER_IDS) {
      const freeUserIds = process.env.DISABLE_STRIPE_CHARGE_FOR_USER_IDS.split(',');

      if (freeUserIds.includes(customer.id)) {
        log.info(`Skipping Stripe charge for user ID ${customer.id}`);
        return { status: 'succeeded' };
      }
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.stripeCustomerId,
      type: 'card',
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountToCharge,
      currency: 'eur',
      customer: customer.stripeCustomerId,
      payment_method: paymentMethods.data[0].id,
      off_session: true,
      confirm: true,
      metadata: paymentIntentMetadata,
    });

    return paymentIntent;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};

const deleteCustomer = async (id) => {
  try {
    const deletedCustomer = await stripe.customers.del(id);
    return deletedCustomer.deleted;
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
};

module.exports = { chargeCustomer, createCustomer, deleteCustomer, retrieveCustomer };
