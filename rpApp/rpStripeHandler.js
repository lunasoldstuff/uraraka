// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_kJnYK5KTZE1M7NqWnNjV2Nc8");
var RedditUser = require('../models/redditUser');

exports.getSubscription = function(userId, callback) {

    RedditUser.findOne({
        id: userId
    }, function(err, data) {
        if (err) throw err;

        if (data.subscriptionId) { //user is subscribed, get subscription data from stripe
            stripe.subscriptions.retrieve(
                data.subscriptionId,
                function(err, subscription) {
                    if (err) throw err;
                    callback(null, subscription);
                }
            );

        } else { //user is not subscribed
            callback(null, false);
        }

    }).catch(function(err) {
        callback(err);
    });

};

exports.subscribe = function(userId, token, email, callback) {
    // console.log('[/subscribe]');
    // console.log('[/subscribe] req.body: ' + JSON.stringify(req.body));
    // console.log('[/subscribe] token: ' + token);

    // Create a Customer:
    stripe.customers.create({
        email: email,
    }).then(function(customer) {
        // YOUR CODE: Save the customer ID and other info in a database for later.
        return stripe.customers.createSource(customer.id, {
            source: token
        });
    }).then(function(source) {

        return stripe.subscriptions.create({
            customer: source.customer,
            items: [{
                plan: 'premium-monthly'
            }]
        });

    }).then(function(subscription) {
        // Use and save the charge info.
        // console.log('[/subscribe] subscription.id: ' + subscription.id);

        //save the subscription id in the user
        RedditUser.findOne({
            id: userId
        }, function(err, data) {
            if (err) throw err;

            if (data) {
                // console.log('[/subscribe] user found, data.name: ' + data.name);
                data.subscriptionId = subscription.id;

                data.save(function(err) {
                    if (err) throw err;
                });
            }
        });

        callback(null, subscription);

    }).catch(function(err) {
        // console.log('[/subscribe] caught error, error: ' + err.statusCode + ': ' + err.message);
        callback(err);
    });

};