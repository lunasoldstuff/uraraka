var paypal = require('paypal-rest-sdk');
var RedditUser = require('../models/redditUser');
var ipn = require('paypal-ipn');

var PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
var PAYPAL_SECRET = process.env.PAYPAL_SECRET;
var BILLING_PLAN_ID = process.env.PAYPAL_BILLING_AGREEMENT_ID;



paypal.configure({
	'mode': 'live', //sandbox or live
	'client_id': PAYPAL_CLIENT_ID,
	'client_secret': PAYPAL_SECRET
});

// createBillingPlan();
// getBillingPlans();
// createBillingAgreement();

exports.handleIpn = function(req, res, next, callback) {
	console.log('[PAYPAL] handleIpn');
	res.send(200);
	ipn.verify(req.body, {
		'allow_sandbox': true
	}, function callback(err, msg) {
		if (err) {
			console.error(err);
		} else {
			console.log('[PAYPAL] IPN Verified');
			// Do stuff with original params here

			if (req.body.payment_status == 'Completed') {
				// Payment has been confirmed as completed
			}
		}
	});
};

exports.handleBillingAgreeemntCreate = function(req, res, next, callback) {
	var isoDate = new Date();
	isoDate.setSeconds(isoDate.getSeconds() + 30);
	isoDate.toISOString().slice(0, 19) + 'Z';

	paypal.billingAgreement.create({
		name: 'billing agreement 1',
		description: 'Thanks for subscribing to reddup',
		start_date: isoDate,
		payer: {
			payment_method: 'paypal'
		},
		plan: {
			id: BILLING_PLAN_ID
		}
	}, function(err, data) {
		if (err) {
			console.log('[PAYPAL] Error creating billing agreement: ' + JSON.stringify(err));
			callback(err);
		} else {
			callback(null, data);
		}
	});

};

exports.handleBillingAgreementExecute = function(req, res, next, callback) {
	paypal.billingAgreement.execute(req.query.token, {}, function(err, billingAgreement) {
		if (err) callback(err);
		else {
			RedditUser.findOne({
				id: req.session.userId
			}, function(err, data) {
				if (err) callback(err);
				if (data) {
					data.billingAgreement = billingAgreement;
					data.save(function(err) {
						if (err) callback(err);
						callback(null);
					});
				}
			});
		}
	});
};

exports.handleGetBillingAgreement = function(req, res, next, callback) {
	RedditUser.findOne({
		id: req.session.userId
	}, function(err, data) {
		if (err) {
			callback(err);
		} else {
			console.log('[PAYPAL] get billing agreement, data.billingAgreement: ' + data.billingAgreement);
			if (data.billingAgreement) {
				callback(null, {
					billingAgreement: data.billingAgreement
				});
			} else {
				callback(null, {
					billingAgreement: false
				});
			}
		}
	}).catch(function(err) {
		callback(err);
	});
};

exports.handleUpdateBillingAgreement = function(req, res, next, callback) {
	RedditUser.findOne({
		id: req.session.userId
	}, function(err, data) {
		if (err) {
			callback(err);
		} else {
			paypal.billingAgreement.get(data.billingAgreement.id, function(err, billingAgreement) {
				if (err) {
					callback(err);
				} else {
					data.billingAgreement = billingAgreement;
					data.save(function(err) {
						if (err) {
							callback(err);
						} else {
							callback(null, data.billingAgreement);
						}
					});
				}
			});
		}
	}).catch(function(err) {
		callback(err);
	});
};

exports.handleCancelBillingAgreement = function(req, res, next, callback) {
	console.log('[PAYPAL] handleCancelBillingAgreement()');

	var cancel_note = {
		note: "Cancelling reddup subscription"
	};

	RedditUser.findOne({
		id: req.session.userId
	}, function(err, data) {
		if (err) {
			callback(err);
		} else {

			console.log('[PAYPAL] handleCancelBillingAgreement() data.billingAgreement.id: ' + data.billingAgreement.id);
			paypal.billingAgreement.cancel(data.billingAgreement.id, cancel_note, function(err, response) {
				if (err) {
					callback(err);
				} else {
					data.billingAgreement = undefined;
					data.save(function(err) {
						if (err) {
							callback(err);
						} else {
							callback();
						}
					});

				}
			});
		}
	}).catch(function(err) {
		callback(err);
	});
};

function createBillingAgreement(callback) {
	var isoDate = new Date();
	isoDate.setSeconds(isoDate.getSeconds() + 30);
	isoDate.toISOString().slice(0, 19) + 'Z';

	paypal.billingAgreement.create({
		name: 'billing agreement 1',
		description: 'reddup subscription',
		start_date: isoDate,
		payer: {
			payment_method: 'paypal'
		},
		plan: {
			id: BILLING_PLAN_ID
		}
	}, function(err, data) {
		if (err) {
			console.log('[PAYPAL] error creating billing agreement: ' + JSON.stringify(err.response));
			throw err;
		} else {
			console.log('[PAYPAL] create billing agreement: ' + JSON.stringify(data));
			callback(data);
		}
	});
}

function getBillingPlans() {
	paypal.billingPlan.list({
		'status': 'ACTIVE'
	}, function(err, data) {
		if (err) {
			console.log('[PAYPAL] error getting billing plans: ' + JSON.stringify(err.response));
		}
		console.log('[PAYPAL] list billing plan: ' + JSON.stringify(data));
		return data;
	});
};

function createBillingPlan() {
	var billingPlan;

	paypal.billingPlan.create({
		"name": "reddup-plus-trial",
		"description": "reddup plus with trial",
		"type": "INFINITE",
		"merchant_preferences": {
			"auto_bill_amount": "yes",
			"cancel_url": "https://www.reddup.co/settings/plus",
			"initial_fail_amount_action": "continue",
			"max_fail_attempts": "1",
			"return_url": "https://www.reddup.co/executeBillingAgreement"
		},
		"payment_definitions": [{
			"name": "Regular",
			"type": "REGULAR",
			"amount": {
				"value": "1",
				"currency": "USD"
			},
			"cycles": "0",
			"frequency": "MONTH",
			"frequency_interval": "1"
		}, {
			"name": "Trial",
			"type": "TRIAL",
			"amount": {
				"value": "0",
				"currency": "USD"
			},
			"cycles": "1",
			"frequency": "WEEK",
			"frequency_interval": "1"
		}]
	}, function(err, data) {
		if (err) {
			console.log('[PAYPAL] error creating billing plan: ' + JSON.stringify(err.response));
		} else {
			console.log('[PAYPAL] create billing plan: ' + JSON.stringify(data));
			billingPlan = data;
			//activate billing plan
			paypal.billingPlan.update(billingPlan.id, [{
				'op': 'replace',
				'path': '/',
				'value': {
					'state': 'ACTIVE'
				}
			}], function(err, data) {
				if (err) console.log('[PAYPAL] error updating billing plan: ' + JSON.stringify(err.response));
				paypal.billingPlan.get(billingPlan.id, function(err, data) {
					console.log('[PAYPAL] updated billing plan: ' + JSON.stringify(data));
					billingPlan = data;
				});
			});
		}
	});
}