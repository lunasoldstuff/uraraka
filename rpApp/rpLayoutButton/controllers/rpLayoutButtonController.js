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

		$scope.singleColumnLayout = rpSettingsService.settings.singleColumnLayout;

		$scope.toggleLayout = function() {
			$scope.singleColumnLayout = !$scope.singleColumnLayout;
			rpSettingsService.setSetting('singleColumnLayout', $scope.singleColumnLayout);
		};

	}
})();