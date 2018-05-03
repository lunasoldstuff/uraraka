var express = require('express');
var router = express.Router();
var paypalHandler = require('./paypalHandler');

router.post('/webhook', function (req, res, next) {
  paypalHandler.handleWebhookEvent(req, res, next, function (error, data) {

  });
});

router.post('/ipn', function (req, res, next) {
  paypalHandler.handleIpn(req, res, next, function (error, data) {});
});

router.get('/createBillingAgreement', function (req, res, next) {
  paypalHandler.handleBillingAgreeemntCreate(req, res, next, function (error, data) {
    if (error) next(error);
    else {
      res.json(data);
    }
  });
});

router.get('/executeBillingAgreement', function (req, res, next) {
  paypalHandler.handleBillingAgreementExecute(req, res, next, function (error) {
    if (error) next(error);
    else {
      res.redirect('/settings/plus');
    }
  });
});

router.get('/billingAgreement', function (req, res, next) {
  paypalHandler.handleGetBillingAgreement(req, res, next, function (error, data) {
    if (error) next(error);
    else {
      res.json(data);
    }
  });
});

router.get('/updateBillingAgreement', function (req, res, next) {
  paypalHandler.handleUpdateBillingAgreement(req, res, next, function (error, data) {
    if (error) next(error);
    else {
      res.json(data);
    }
  });
});

router.get('/cancelBillingAgreement', function (req, res, next) {
  paypalHandler.handleCancelBillingAgreement(req, res, next, function (error, data) {
    if (error) next(error);
    else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
