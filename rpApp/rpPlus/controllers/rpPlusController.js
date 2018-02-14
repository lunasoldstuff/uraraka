(function() {
	'use strict';
	angular.module('rpPlus').controller('rpPlusCtrl', ['$scope',
		'$rootScope',
		'$timeout',
		'$mdDialog',
		'$mdBottomSheet',
		'rpPlusSubscriptionUtilService',
		'rpAuthService',
		rpPlusCtrl
	]);

	function rpPlusCtrl(
		$scope,
		$rootScope,
		$timeout,
		$mdDialog,
		$mdBottomSheet,
		rpPlusSubscriptionUtilService,
		rpAuthService
	) {
		console.log('[rpPlusCtrl]');

		$scope.isAuthenticated = rpAuthService.isAuthenticated;

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
})();
