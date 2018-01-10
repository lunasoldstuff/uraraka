'use strict';

var rpPremiumControllers = angular.module('rpPremiumControllers', []);

rpPremiumControllers.controller('rpPremiumSidenavCtrl', [
	'$scope',
	'$rootScope',
	'$mdDialog',
	'rpSettingsUtilService',
	'rpLocationUtilService',
	'rpIsMobileViewUtilService',
	'rpPremiumSubscriptionUtilService',

	function(
		$scope,
		$rootScope,
		$mdDialog,
		rpSettingsUtilService,
		rpLocationUtilService,
		rpIsMobileViewUtilService,
		rpPremiumSubscriptionUtilService

	) {
		console.log('[rpPremiumSidenavCtrl] load');

		checkSubscription();
		$scope.showPremium = function(e) {

			console.log('[rpPremiumSidenavCtrl] $scope.$parent.animations: ' + $scope.$parent.animations);
			console.log('[rpPremiumSidenavCtrl] $scope.animations: ' + $scope.animations);

			if ((rpSettingsUtilService.settings.settingsDialog && !e.ctrlKey) || rpIsMobileViewUtilService.isMobileView()) {
				$mdDialog.show({
					controller: 'rpSettingsDialogCtrl',
					templateUrl: 'rpSettingsDialog.html',
					clickOutsideToClose: true,
					escapeToClose: true,
					locals: {
						animations: $scope.animations,
						theme: $scope.theme,
						tab: 1
					}
				});

			} else {
				rpLocationUtilService(e, '/settings', 'selected=1', true, false);
			}

		};

		var deregisterPremiumSubscriptionUpdate = $rootScope.$on('rp_premium_subscription_update', function(e, isSubscribed) {
			$scope.isSubscribed = isSubscribed;
		});

		function checkSubscription() {
			rpPremiumSubscriptionUtilService.isSubscribed(function(isSubscribed) {
				$scope.isSubscribed = isSubscribed;
			});
		}

		$scope.$on('$destroy', function() {
			deregisterPremiumSubscriptionUpdate();
		});
	}
]);

rpPremiumControllers.controller('rpPremiumCtrl', [
	'$scope',
	'$rootScope',
	'$mdDialog',
	'$mdBottomSheet',
	'rpPremiumSubscriptionUtilService',
	'rpAuthUtilService',

	function(
		$scope,
		$rootScope,
		$mdDialog,
		$mdBottomSheet,
		rpPremiumSubscriptionUtilService,
		rpAuthUtilService
	) {
		console.log('[rpPremiumCtrl]');

		$scope.isAuthenticated = rpAuthUtilService.isAuthenticated;

		var deregisterPremiumSubscriptionUpdate = $rootScope.$on('rp_premium_subscription_update', function(e, isSubscribed) {
			$scope.isSubscribed = isSubscribed;
		});

		function checkSubscription() {
			rpPremiumSubscriptionUtilService.isSubscribed(function(isSubscribed) {
				$scope.isSubscribed = isSubscribed;
			});
		}

		$scope.toggleShowForm = function(e) {
			console.log('[rpPremiumCtrl] showForm()');
			$scope.showForm = !$scope.showForm;
		};

		$scope.closeDialog = function(e) {
			$mdDialog.hide();
			$mdBottomSheet.hide();
		};

		$scope.subscribing = false;
		$scope.subscribe = function() {
			$scope.subscribing = true;
			rpPremiumSubscriptionUtilService.subscribe();
		};

		$scope.$on('$destroy', function() {
			deregisterPremiumSubscriptionUpdate();
		});

		checkSubscription();
	}
]);

rpPremiumControllers.controller('rpPremiumSubscriptionCtrl', [
	'$scope',
	'$rootScope',
	'moment',
	'rpPremiumSubscriptionUtilService',


	function(
		$scope,
		$rootScope,
		moment,
		rpPremiumSubscriptionUtilService

	) {
		console.log('[rpPremiumSubscriptionCtrl]');

		$scope.billingAgreement = null;
		$scope.showCancelConfirmation = false;
		$scope.cancelling = false;

		$scope.toggleCancelConfirmation = function(e) {
			$scope.showCancelConfirmation = !$scope.showCancelConfirmation;
		};

		$scope.cancelSubscription = function(e) {
			$scope.cancelling = true;
			console.log('[rpPremiumSubscriptionCtrl] cancelSubscription()');
			rpPremiumSubscriptionUtilService.cancel(function(error) {
				if (error) {
					console.log('[rpPremiumSubscriptionCtrl] cancelSubscription(), error cancelling subscription');
				} else {
					console.log('[rpPremiumSubscriptionCtrl] cancelSubscription(), subscription canceled');
				}
				$scope.cancelling = false;
			});

		};

		var deregisterPremiumSubscriptionUpdate = $rootScope.$on('rp_premium_subscription_update', function(e, isSubscribed) {
			getBillingAgreement();
		});

		function getBillingAgreement() {
			rpPremiumSubscriptionUtilService.getBillingAgreement(function(data) {
				$scope.billingAgreement = data;
				$scope.currentPeriodStart = moment(new Date($scope.billingAgreement.start_date)).format("Do MMMM, YYYY");
				$scope.currentPeriodEnd = moment(new Date($scope.billingAgreement.agreement_details.next_billing_date)).format("Do MMMM, YYYY");
			});
		}

		getBillingAgreement();

		$scope.$on('$destroy', function() {
			deregisterPremiumSubscriptionUpdate();
		});

	}
]);

// rpPremiumControllers.controller('rpPremiumFormCtrl', [
//     '$scope',
//     function($scope) {
//         console.log('[rpPremiumFormCtrl]');
//
//         $scope.submit = function(e) {
//             console.log('[rpPremiumFormCtrl] submit()');
//
//
//
//
//         };
//
//     }
// ]);