(function () {
  'use strict';

  function rpPlusPaypalCreateBillingAgreeement($resource) {
    return $resource('/api/paypal/createBillingAgreement');
  }

  function rpPlusPaypalBillingAgreeement($resource) {
    return $resource('/api/paypal/billingAgreement');
  }

  function rpPlusPaypalUpdateBillingAgreeement($resource) {
    return $resource('/api/paypal/updateBillingAgreement');
  }

  function rpPlusPaypalCancelBillingAgreeement($resource) {
    return $resource('/api/paypal/cancelBillingAgreement');
  }

  angular.module('rpPlus')
    .factory('rpPlusPaypalCreateBillingAgreeement', [
      '$resource',
      rpPlusPaypalCreateBillingAgreeement
    ])
    .factory('rpPlusPaypalBillingAgreeement', [
      '$resource',
      rpPlusPaypalBillingAgreeement
    ])
    .factory('rpPlusPaypalUpdateBillingAgreeement', [
      '$resource',
      rpPlusPaypalUpdateBillingAgreeement
    ])
    .factory('rpPlusPaypalCancelBillingAgreeement', [
      '$resource',
      rpPlusPaypalCancelBillingAgreeement
    ]);
}());
