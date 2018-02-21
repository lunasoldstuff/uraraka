(function() {
	'use strict';
	angular.module('rpPlus').factory('rpPlusPaypalCreateBillingAgreeement', [
		'$resource',
		rpPlusPaypalCreateBillingAgreeement
	]).factory('rpPlusPaypalBillingAgreeement', [
		'$resource',
		rpPlusPaypalBillingAgreeement
	]).factory('rpPlusPaypalUpdateBillingAgreeement', [
		'$resource',
		rpPlusPaypalUpdateBillingAgreeement
	]).factory('rpPlusPaypalCancelBillingAgreeement', [
		'$resource',
		rpPlusPaypalCancelBillingAgreeement
	]);

	function rpPlusPaypalCreateBillingAgreeement($resource) {
		return $resource('/paypal/createBillingAgreement');
	}

	function rpPlusPaypalBillingAgreeement($resource) {
		return $resource('/paypal/billingAgreement');
	}

	function rpPlusPaypalUpdateBillingAgreeement($resource) {
		return $resource('/paypal/updateBillingAgreement');
	}

	function rpPlusPaypalCancelBillingAgreeement($resource) {
		return $resource('/paypal/cancelBillingAgreement');
	}
})();