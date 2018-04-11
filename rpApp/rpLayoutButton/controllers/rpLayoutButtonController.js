(function() {
	'use strict';
	angular.module('rpLayoutButton').controller('rpLayoutButtonCtrl', [
		'$scope',
		'$rootScope',
		'rpSettingsService',
		rpLayoutButtonCtrl
	]);

	function rpLayoutButtonCtrl($scope, $rootScope, rpSettingsService) {
		console.log('[rpLayoutButtonCtrl] load');

		// $scope.singleColumnLayout = rpSettingsService.settings.singleColumnLayout;
		//
		// $scope.toggleLayout = function() {
		// 	$scope.singleColumnLayout = !$scope.singleColumnLayout;
		// 	rpSettingsService.setSetting('singleColumnLayout', $scope.singleColumnLayout);
		// };

		$scope.layout = rpSettingsService.getSettings().layout;
		console.log('[rpLayoutButtonCtrl] $scope.layout: ' + $scope.layout);

		$scope.changeLayout = function() {
			console.log('[rpLayoutButtonCtrl] changeLayout(), $scope.layout: ' + $scope.layout);
			rpSettingsService.setSetting('layout', $scope.layout);
		};

		var deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function() {
			$scope.layout = rpSettingsService.getSettings().layout;
		});

		$scope.$on('$destroy', function() {
			deregisterSettingsChanged();
		});

	}
})();