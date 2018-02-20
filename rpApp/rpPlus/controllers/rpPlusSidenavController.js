(function() {
	'use strict';
	angular.module('rpPlus').controller('rpPlusSidenavCtrl', ['$scope',
		'$rootScope',
		'$mdDialog',
		'rpSettingsService',
		'rpAppLocationService',
		'rpAppIsMobileViewService',
		'rpPlusSubscriptionService',
		rpPlusSidenavCtrl
	]);

	function rpPlusSidenavCtrl(
		$scope,
		$rootScope,
		$mdDialog,
		rpSettingsService,
		rpAppLocationService,
		rpAppIsMobileViewService,
		rpPlusSubscriptionService

	) {
		console.log('[rpPlusSidenavCtrl] load');

		checkSubscription();
		$scope.showPlus = function(e) {

			console.log('[rpPlusSidenavCtrl] $scope.$parent.animations: ' + $scope.$parent.animations);
			console.log('[rpPlusSidenavCtrl] $scope.animations: ' + $scope.animations);

			if ((rpSettingsService.settings.settingsDialog && !e.ctrlKey) || rpAppIsMobileViewService.isMobileView()) {
				$mdDialog.show({
					controller: 'rpSettingsDialogCtrl',
					templateUrl: 'rpSettings/views/rpSettingsDialog.html',
					clickOutsideToClose: true,
					escapeToClose: true,
					locals: {
						animations: $scope.animations,
						theme: $scope.theme,
						tab: 1
					}
				});

			} else {
				rpAppLocationService(e, '/settings', 'selected=1', true, false);
			}

		};

		var deregisterPlusSubscriptionUpdate = $rootScope.$on('rp_plus_subscription_update', function(e, isSubscribed) {
			$scope.isSubscribed = isSubscribed;
		});

		function checkSubscription() {
			rpPlusSubscriptionService.isSubscribed(function(isSubscribed) {
				$scope.isSubscribed = isSubscribed;
			});
		}

		$scope.$on('$destroy', function() {
			deregisterPlusSubscriptionUpdate();
		});
	}
})();