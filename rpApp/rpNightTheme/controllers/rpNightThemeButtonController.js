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

		$scope.isNightTheme = rpSettingsService.settings.darkTheme;

		$scope.toggleNightTheme = function() {
			$scope.isNightTheme = !$scope.isNightTheme;
			rpSettingsService.setSetting('darkTheme', $scope.isNightTheme);
		};

		var deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function() {
			$scope.isNightTheme = rpSettingsService.settings.darkTheme;
		});

		$scope.$on('$destroy', function() {
			deregisterSettingsChanged();
		});

	}

})();