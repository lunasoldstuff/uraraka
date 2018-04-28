'use strict';

(function () {
	'use strict';

	angular.module('rpToolbar').controller('rpToolbarOverflowMenuLayoutButtonCtrl', ['$scope', '$rootScope', 'rpSettingsService', rpToolbarOverflowMenuLayoutButtonCtrl]);

	function rpToolbarOverflowMenuLayoutButtonCtrl($scope, $rootScope, rpSettingsService) {
		console.log('[rpToolbarOverflowMenuLayoutButtonCtrl] load');

		$scope.layout = rpSettingsService.getSettings().layout;
		console.log('[rpToolbarOverflowMenuLayoutButtonCtrl] $scope.layout: ' + $scope.layout);

		$scope.toggleLayout = function () {
			if ($scope.layout === 'listLayout') {
				rpSettingsService.setSetting('layout', 'singleColumnLayout');
			} else {
				$scope.layout = 'listLayout';
				rpSettingsService.setSetting('layout', 'listLayout');
			}
			$scope.layout = rpSettingsService.getSettings().layout;
			console.log('[rpToolbarOverflowMenuLayoutButtonCtrl] toggleLayout(), $scope.layout: ' + $scope.layout);
		};

		var deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function () {
			$scope.layout = rpSettingsService.getSettings().layout;
		});

		$scope.$on('$destroy', function () {
			deregisterSettingsChanged();
		});
	}
})();