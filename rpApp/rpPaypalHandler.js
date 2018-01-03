var paypal = require('paypal-rest-sdk');
var RedditUser = require('../models/redditUser');

var PAYPAL_CLIENT_ID = 'AZdNlLM0SqubRKjnqmBQTmWYsMHEEZas0snJWgVViVpdMDwinm9bIE3iOKmM_5ytQ6t1gw4TcYxima6l';
var PAYPAL_SECRET = 'EJVojn2I9TPgJ_prCikatMCKBHaYRXAmvtBPtRIOKr9_j4_ZpSndLaBUyJFGdifUiW8ARBhzrGBcLVmE';
var BILLING_PLAN_ID = 'P-5KC110643J2562458XQUWBTQ';



paypal.configure({
	'mode': 'sandbox', //sandbox or live
	'client_id': PAYPAL_CLIENT_ID,
	'client_secret': PAYPAL_SECRET
});

// createBillingPlan();
// getBillingPlans();
// createBillingAgreement();

exports.handleBillingAgreeemntCreate = function(req, res, next, callback) {
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
			callback(err);
		} else {
			console.log('[PAYPAL] create billing agreement: ' + JSON.stringify(data));
			callback(null, data);
		}
	});

};

exports.handleBillingAgreementExecute = function(req, res, next, callback) {
	console.log('[PAYPAL] handleBillingAgreementSubscribe, token: ' + req.query.token);
	console.log('[PAYPAL] handleBillingAgreementSubscribe, userId: ' + req.session.userId);
	paypal.billingAgreement.execute(req.query.token, {}, function(err, billingAgreement) {
		console.log('[PAYPAL] handleBillingAgreementSubscribe, billingAgreement id: ' + billingAgreement.id);

		if (err) callback(err);
		else {
			RedditUser.findOne({
				id: req.session.userId
			}, function(err, data) {
				if (err) callback(err);

				if (data) {
					console.log('[PAYPAL] user name: ' + data.name);

					data.billingAgreementId = billingAgreement.id;

					data.save(function(err) {
						if (err) callback(err);
						console.log('[PAYPAL] handleBillingAgreementSubscribe, billAgreement saved');
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
		if (err) callback(err);
		else callback(null, data);
	}).catch(function(err) {
		callback(err);
	});
};

function executeBillingAgreement(paymentToken, callback) {
	paypal.billingAgreement.execute(paymentToken, {}, function(err, data) {
		if (err) {
			console.log('[PAYPAL] error executing billing agreement: ' + JSON.stringify(err.response));
			throw err;
		} else {
			console.log('[PAYPAL] execute billing agreement: ' + JSON.stringify(data));
			//save billing agreement in database for user, unlock premium subscription.
		}
	});
}

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
		"name": "reddup-premium-trial",
		"description": "reddup premium with trial",
		"type": "INFINITE",
		"merchant_preferences": {
			"auto_bill_amount": "yes",
			"cancel_url": "https://www.reddup.co/settings/cancelBillingAgreement",
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