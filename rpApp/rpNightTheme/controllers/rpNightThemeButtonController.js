(function() {
	'use strict';
	angular.module('rpNightTheme').controller('rpNightThemeButtonCtrl', [
		'$scope',
		'$rootScope',
		'rpSettingsService',
		rpNightThemeButtonCtrl
	]);


	function rpNightThemeButtonCtrl($scope, $rootScope, rpSettingsService) {
		console.log('[rpNightThemeButtonCtrl] load');

		$scope.isNightTheme = rpSettingsService.settings.nightTheme;

		$scope.toggleNightTheme = function() {
			$scope.isNightTheme = !$scope.isNightTheme;
			rpSettingsService.setSetting('nightTheme', $scope.isNightTheme);
		};

		var deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function() {
			$scope.isNightTheme = rpSettingsService.settings.nightTheme;
		});

		$scope.$on('$destroy', function() {
			deregisterSettingsChanged();
		});

	}

})();