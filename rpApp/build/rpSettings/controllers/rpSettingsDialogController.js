'use strict';

(function () {
	'use strict';

	angular.module('rpSettings').controller('rpSettingsDialogCtrl', ['$scope', '$rootScope', '$mdDialog', 'rpSettingsService', 'animations', 'theme', 'tab', rpSettingsDialogCtrl]);

	function rpSettingsDialogCtrl($scope, $rootScope, $mdDialog, rpSettingsService, animations, theme, tab) {

		console.log('[rpSettingsDialogCtrl] theme: ' + theme);
		$scope.theme = theme;
		$scope.animations = animations;
		$scope.selected = tab;
		// $scope.animations = rpSettingsService.settings.animations;

		$scope.isDialog = true;

		//Close the dialog if user navigates to a new page.
		var deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function () {
			$mdDialog.hide();
		});

		var deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function () {
			$scope.theme = rpSettingsService.settings.theme;
			console.log('[rpSettingsDialogCtrl] rp_settings_changed, $scope.theme: ' + $scope.theme);
		});

		$scope.$on('$destroy', function () {
			deregisterLocationChangeSuccess();
			deregisterSettingsChanged();
		});
	}
})();