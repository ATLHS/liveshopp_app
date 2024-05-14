const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);

module.exports = {
    createCustomer: (customerData) => {
        return stripe.customers
            .create({
                name: customerData.company_name || customerData.firstname,
                email: customerData.email,
                phone: customerData.phone || ''
            })
            .then((customer) => {
                return customer;
            })
            .catch(() => {
                return false;
            });
    },
    retrieveCustomer: (id) => {
        return stripe.customers
            .retrieve(id)
            .then((customer) => {
                return customer;
            })
            .catch((err) => {
                console.error(err, 'err')
                return false;
            });
    },
    chargeCustomer: async (amountToCharge, customerId, paymentIntentMetadata) => {
        const paymentMethods = await stripe.paymentMethods.list({
            customer: customerId,
            type: 'card',
        });

        try {
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
        } catch (err) {
            console.error(err, 'err');
            throw new Error(err.message);
        }
    },
    deleteCustomer: (id) => {
        return stripe.customers
            .del(id)
            .then((customer) => {
                return customer.deleted;
            })
            .catch((err) => {
                console.error(err, 'err')
                return false;
            });
    },
};
