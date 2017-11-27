// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_kJnYK5KTZE1M7NqWnNjV2Nc8");
var RedditUser = require('../models/redditUser');


exports.subscribe = function(req, res, next, callback) {
    console.log('[/subscribe]');
    console.log('[/subscribe] req.body: ' + JSON.stringify(req.body));

    var token = req.body.token; // Using Express
    var email = req.body.email;
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
        console.log('[/subscribe] subscription.id: ' + subscription.id);

        //save the subscription id in the user
        //TODO if we threw the errors in the code blocks below instead of calling next, would the CODE after them keep executing and would the be picked up by the catch?
        RedditUser.findOne({
            id: req.session.userId
        }, function(err, data) {
            if (err) next(err);

            if (data) {
                console.log('[/subscribe] user found, data.name: ' + data.name);
                data.subscriptionId = subscription.id;

                data.save(function(err) {
                    if (err) next(err);
                });
            }
        });

        callback(null, subscription);

    }).catch(function(err) {
        console.log('[/subscribe] caught error, error: ' + err.statusCode + ': ' + err.message);
        callback(err);
    });

};