(function() {
	'use strict';
	angular.module('rpPlus').factory('rpPlusSubscriptionService', [
		'$rootScope',
		'$window',
		'rpAppAuthService',
		'rpPaypalCreateBillingAgreeement',
		'rpPaypalBillingAgreeement',
		'rpPaypalCancelBillingAgreeement',
		'rpPaypalUpdateBillingAgreeement',
		'rpToastService',
		'rpAppSettingsService',
		rpPlusSubscriptionService
	]);

	function rpPlusSubscriptionService(
		$rootScope,
		$window,
		rpAppAuthService,
		rpPaypalCreateBillingAgreeement,
		rpPaypalBillingAgreeement,
		rpPaypalCancelBillingAgreeement,
		rpPaypalUpdateBillingAgreeement,
		rpToastService,
		rpAppSettingsService

	) {
		console.log('[rpPlusSubscriptionService]');

		var rpPlusSubscriptionService = {};
		var callbacks = [];
		var gettingBillingAgreement = false;

		rpPlusSubscriptionService.billingAgreement = null;

		rpPlusSubscriptionService.isSubscribed = function(callback) {
			rpPlusSubscriptionService.getBillingAgreement(function(data) {
				console.log('[rpPlusSubscriptionService] isSubscribed(), billingAgreement: ' + rpPlusSubscriptionService.billingAgreement);
				callback(!!rpPlusSubscriptionService.billingAgreement);
			});
		};

		//returns bill agreement if subscribed or false if not.
		rpPlusSubscriptionService.getBillingAgreement = function(callback) {
			console.log('[rpPlusSubscriptionService] getBillingAgreement()');

			if (rpAppAuthService.isAuthenticated) {
				if (rpPlusSubscriptionService.billingAgreement !== null) {
					callback(rpPlusSubscriptionService.billingAgreement);
				} else {
					callbacks.push(callback);
					gettingBillingAgreement = true;

					rpPaypalBillingAgreeement.get({}, function(data) {
						console.log('[rpPlusSubscriptionService] getBillingAgreement(), data: ' + JSON.stringify(data));
						if (data.error) {
							console.log('[rpPlusSubscriptionService] error retrieving subscription from server');
						} else {
							gettingBillingAgreement = false;
							updateBillingAgreement(data.billingAgreement);

							for (var i = 0; i < callbacks.length; i++) {
								callbacks[i](data.billingAgreement);
							}

							callbacks = [];

						}
					});

				}

			} else {
				callback(null);
			}
		};

		rpPlusSubscriptionService.subscribe = function(email, token, callback) {
			console.log('[rpPlusSubscriptionService] subscribe()');

			rpPaypalCreateBillingAgreeement.get(function(data) {
				for (var i = 0; i < data.links.length; i++) {
					if (data.links[i].rel === 'approval_url') {
						//redirect
						$window.open(data.links[i].href, '_self');
						break;
					}
				}
			});
		};

		rpPlusSubscriptionService.cancel = function(callback) {
			rpPaypalCancelBillingAgreeement.get({}, function(data) {
				if (data.error) {
					console.log('[rpPlusSubscriptionService] cancel(), data.error: ' + JSON.stringify(data.error));
					callback(data.error);
				} else {
					console.log('[rpPlusSubscriptionService] cancel(), subscription cancelled, data: ' + JSON.stringify(data));
					rpToastService('subscription cancelled', "sentiment_dissatisfied");
					updateBillingAgreement(null);

					callback();
				}
			}, function(error) {
				rpToastService('something went wrong cancelling your subscription', "sentiment_dissatisfied");
				console.log('[rpPlusSubscriptionService] cancel(), error: ' + JSON.stringify(error));
				callback(error);
			});
		};

		function updateBillingAgreement(billingAgreement) {
			rpPlusSubscriptionService.billingAgreement = billingAgreement;
			$rootScope.$emit('rp_plus_subscription_update', !!rpPlusSubscriptionService.billingAgreement);
		}

		return rpPlusSubscriptionService;
	}
})();