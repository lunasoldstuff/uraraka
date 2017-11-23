// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_kJnYK5KTZE1M7NqWnNjV2Nc8");

exports.subscribe = function(body, callback) {
    console.log('[/subscribe]');
    console.log('[/subscribe] body: ' + JSON.stringify(body));

    var token = body.token; // Using Express
    var email = body.email;
    // customer: body.email,
    console.log('[/subscribe] token: ' + token);

    // Create a Customer:
    stripe.customers.create({
        email: email,
    }).then(function(customer) {
        // YOUR CODE: Save the customer ID and other info in a database for later.
        return stripe.customers.createSource(customer.id, {
            source: token
        });
    }).then(function(source) {
        // return stripe.charges.create({
        //     amount: 100,
        //     currency: "usd",
        //     customer: source.customer
        // });

        return stripe.subscriptions.create({
            customer: source.customer,
            items: [{
                plan: 'premium-monthly'
            }]
        });

    }).then(function(subscription) {
        // Use and save the charge info.
        console.log('[/subscribe] subscription.id: ' + subscription.id);
        callback(null, subscription);

    }).catch(function(err) {
        console.log('[/subscribe] caught error, error: ' + err.statusCode + ': ' + err.message);
        callback(err);
    });

};