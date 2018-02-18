(function() {
	'use strict';
	angular.module('rpLayoutButton').controller('rpLayoutButtonCtrl', [
		'$scope',
		'$rootScope',
		'rpAppSettingsService',
		rpLayoutButtonCtrl
	]);

	function rpLayoutButtonCtrl($scope, $rootScope, rpAppSettingsService) {
		console.log('[rpLayoutButtonCtrl] load');

		$scope.singleColumnLayout = rpAppSettingsService.settings.singleColumnLayout;

		$scope.toggleLayout = function() {
			$scope.singleColumnLayout = !$scope.singleColumnLayout;
			rpAppSettingsService.setSetting('singleColumnLayout', $scope.singleColumnLayout);
		};

	}
})();