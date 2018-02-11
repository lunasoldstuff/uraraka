'use strict';

var rpPlusControllers = angular.module('rpPlusControllers', []);

rpPlusControllers.controller('rpPlusSidenavCtrl', [
	'$scope',
	'$rootScope',
	'$mdDialog',
	'rpSettingsService',
	'rpLocationUtilService',
	'rpIsMobileViewService',
	'rpPlusSubscriptionUtilService',

	function(
		$scope,
		$rootScope,
		$mdDialog,
		rpSettingsService,
		rpLocationUtilService,
		rpIsMobileViewService,
		rpPlusSubscriptionUtilService

	) {
		console.log('[rpPlusSidenavCtrl] load');

		checkSubscription();
		$scope.showPlus = function(e) {

			console.log('[rpPlusSidenavCtrl] $scope.$parent.animations: ' + $scope.$parent.animations);
			console.log('[rpPlusSidenavCtrl] $scope.animations: ' + $scope.animations);

			if ((rpSettingsService.settings.settingsDialog && !e.ctrlKey) || rpIsMobileViewService.isMobileView()) {
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

		var deregisterPlusSubscriptionUpdate = $rootScope.$on('rp_plus_subscription_update', function(e, isSubscribed) {
			$scope.isSubscribed = isSubscribed;
		});

		function checkSubscription() {
			rpPlusSubscriptionUtilService.isSubscribed(function(isSubscribed) {
				$scope.isSubscribed = isSubscribed;
			});
		}

		$scope.$on('$destroy', function() {
			deregisterPlusSubscriptionUpdate();
		});
	}
]);

rpPlusControllers.controller('rpPlusCtrl', [
	'$scope',
	'$rootScope',
	'$timeout',
	'$mdDialog',
	'$mdBottomSheet',
	'rpPlusSubscriptionUtilService',
	'rpAuthUtilService',

	function(
		$scope,
		$rootScope,
		$timeout,
		$mdDialog,
		$mdBottomSheet,
		rpPlusSubscriptionUtilService,
		rpAuthUtilService
	) {
		console.log('[rpPlusCtrl]');

		$scope.isAuthenticated = rpAuthUtilService.isAuthenticated;

		var deregisterPlusSubscriptionUpdate = $rootScope.$on('rp_plus_subscription_update', function(e, isSubscribed) {
			$scope.isSubscribed = isSubscribed;
		});

		function checkSubscription() {
			rpPlusSubscriptionUtilService.isSubscribed(function(isSubscribed) {
				$scope.isSubscribed = isSubscribed;
			});
		}

		$scope.toggleShowForm = function(e) {
			console.log('[rpPlusCtrl] showForm()');
			$scope.showForm = !$scope.showForm;
		};

		$scope.closeDialog = function(e) {
			$mdDialog.hide();
			$mdBottomSheet.hide();
		};

		$scope.subscribing = false;
		$scope.subscribe = function() {
			$timeout(function() {
				$scope.subscribing = true;
				rpPlusSubscriptionUtilService.subscribe();
			}, 0);
		};

		$scope.$on('$destroy', function() {
			deregisterPlusSubscriptionUpdate();
		});

		checkSubscription();
	}
]);

rpPlusControllers.controller('rpPlusSubscriptionCtrl', [
	'$scope',
	'$rootScope',
	'moment',
	'rpPlusSubscriptionUtilService',


	function(
		$scope,
		$rootScope,
		moment,
		rpPlusSubscriptionUtilService

	) {
		console.log('[rpPlusSubscriptionCtrl]');

		$scope.billingAgreement = null;
		$scope.showCancelConfirmation = false;
		$scope.cancelling = false;

		$scope.toggleCancelConfirmation = function(e) {
			$scope.showCancelConfirmation = !$scope.showCancelConfirmation;
		};

		$scope.cancelSubscription = function(e) {
			$scope.cancelling = true;
			console.log('[rpPlusSubscriptionCtrl] cancelSubscription()');
			rpPlusSubscriptionUtilService.cancel(function(error) {
				if (error) {
					console.log('[rpPlusSubscriptionCtrl] cancelSubscription(), error cancelling subscription');
				} else {
					console.log('[rpPlusSubscriptionCtrl] cancelSubscription(), subscription canceled');
				}
				$scope.cancelling = false;
			});

		};

		var deregisterPlusSubscriptionUpdate = $rootScope.$on('rp_plus_subscription_update', function(e, isSubscribed) {
			getBillingAgreement();
		});

		function getBillingAgreement() {
			rpPlusSubscriptionUtilService.getBillingAgreement(function(data) {
				$scope.billingAgreement = data;
				if (data) {
					$scope.currentPeriodStart = moment(new Date($scope.billingAgreement.start_date)).format("Do MMMM, YYYY");
					$scope.currentPeriodEnd = moment(new Date($scope.billingAgreement.agreement_details.next_billing_date)).format("Do MMMM, YYYY");
				}
			});
		}

		getBillingAgreement();

		$scope.$on('$destroy', function() {
			deregisterPlusSubscriptionUpdate();
		});

	}
]);