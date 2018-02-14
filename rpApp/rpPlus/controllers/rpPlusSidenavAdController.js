(function() {
	'use strict';
	angular.module('rpPlus').controller('rpPlusSidenavAdCtrl', [
		'$scope',
		'$mdDialog',
		'rpAppSettingsService',
		'rpAppIsMobileViewService',
		'rpAppLocationService',
		rpPlusSidenavAdCtrl
	]);

	function rpPlusSidenavAdCtrl(
		$scope,
		$mdDialog,
		rpAppSettingsService,
		rpAppIsMobileViewService,
		rpAppLocationService
	) {
		console.log('[rpPlusSidenavCtrl]');
		$scope.showPlus = function(e) {

			console.log('[rpPlusSidenavCtrl] $scope.$parent.animations: ' + $scope.$parent.animations);
			console.log('[rpPlusSidenavCtrl] $scope.animations: ' + $scope.animations);

			if ((rpAppSettingsService.settings.settingsDialog && !e.ctrlKey) || rpAppIsMobileViewService.isMobileView()) {
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
				rpAppLocationService(e, '/settings', '', true, false);
			}

		};

	}

})();