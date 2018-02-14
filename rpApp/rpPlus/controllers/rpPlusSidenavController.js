(function() {
	'use strict';
	angular.module('rpPlus').controller('rpPlusSidenavCtrl', ['$scope',
		'$rootScope',
		'$mdDialog',
		'rpAppSettingsService',
		'rpAppLocationService',
		'rpAppIsMobileViewService',
		'rpPlusSubscriptionUtilService',
		rpPlusSidenavCtrl
	]);

	function rpPlusSidenavCtrl(
		$scope,
		$rootScope,
		$mdDialog,
		rpAppSettingsService,
		rpAppLocationService,
		rpAppIsMobileViewService,
		rpPlusSubscriptionUtilService

	) {
		console.log('[rpPlusSidenavCtrl] load');

		checkSubscription();
		$scope.showPlus = function(e) {

			console.log('[rpPlusSidenavCtrl] $scope.$parent.animations: ' + $scope.$parent.animations);
			console.log('[rpPlusSidenavCtrl] $scope.animations: ' + $scope.animations);

			if ((rpAppSettingsService.settings.settingsDialog && !e.ctrlKey) || rpAppIsMobileViewService.isMobileView()) {
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
				rpAppLocationService(e, '/settings', 'selected=1', true, false);
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
})();