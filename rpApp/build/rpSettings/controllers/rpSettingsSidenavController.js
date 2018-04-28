'use strict';

(function () {
	'use strict';

	angular.module('rpSettings').controller('rpSettingsSidenavCtrl', ['$scope', '$rootScope', '$mdDialog', '$mdPanel', 'rpSettingsService', 'rpAppLocationService', 'rpAppIsMobileViewService', rpSettingsSidenavCtrl]);

	function rpSettingsSidenavCtrl($scope, $rootScope, $mdDialog, $mdPanel, rpSettingsService, rpAppLocationService, rpAppIsMobileViewService) {
		console.log('[rpSettingsSidenavCtrl]');
		$scope.showSettings = function (e) {

			console.log('[rpSettingsSidenavCtrl] $scope.$parent.animations: ' + $scope.$parent.animations);
			console.log('[rpSettingsSidenavCtrl] $scope.animations: ' + $scope.animations);

			if (rpSettingsService.settings.settingsDialog && !e.ctrlKey || rpAppIsMobileViewService.isMobileView()) {
				$mdDialog.show({
					controller: 'rpSettingsDialogCtrl',
					templateUrl: 'rpSettings/views/rpSettingsDialog.html',
					clickOutsideToClose: true,
					escapeToClose: true,
					locals: {
						animations: $scope.animations,
						theme: $scope.theme,
						tab: 0
					}

				});
			} else {
				rpAppLocationService(e, '/settings', '', true, false);
			}
		};

		$scope.$on('$destroy', function () {});
	}
})();