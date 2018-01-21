var express = require('express');
var router = express.Router();
var rpPaypalHandler = require('./paypalHandler');

router.post('/webhook', function(req, res, next) {
	console.log('[PAYPAL] router: /paypal/webhook');
	rpPaypalHandler.handleWebhookEvent(req, res, next, function(error, data) {

	});
});

router.post('/ipn', function(req, res, next) {
	console.log('[PAYPAL] router: /paypal/ipn');
	rpPaypalHandler.handleIpn(req, res, next, function(error, data) {

	});
});

router.get('/createBillingAgreement', function(req, res, next) {
	rpPaypalHandler.handleBillingAgreeemntCreate(req, res, next, function(error, data) {
		if (error) next(error);
		else {
			res.json(data);
		}
	});
});

router.get('/executeBillingAgreement', function(req, res, next) {
	rpPaypalHandler.handleBillingAgreementExecute(req, res, next, function(error) {
		if (error) next(error);
		else {
			res.redirect('/settings/plus');
		}
	});
});

router.get('/billingAgreement', function(req, res, next) {
	rpPaypalHandler.handleGetBillingAgreement(req, res, next, function(error, data) {
		if (error) next(error);
		else {
			res.json(data);
		}
	});
});

router.get('/updateBillingAgreement', function(req, res, next) {
	rpPaypalHandler.handleUpdateBillingAgreement(req, res, next, function(error, data) {
		if (error) next(error);
		else {
			res.json(data);
		}
	});
});

router.get('/cancelBillingAgreement', function(req, res, next) {
	rpPaypalHandler.handleCancelBillingAgreement(req, res, next, function(error, data) {
		if (error) next(error);
		else {
			res.sendStatus(200);
		}
	});
});

module.exports = router;