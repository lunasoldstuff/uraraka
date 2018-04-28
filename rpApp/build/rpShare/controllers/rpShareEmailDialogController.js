'use strict';

(function () {
	'use strict';

	angular.module('rpShare').controller('rpShareEmailDialogCtrl', ['$scope', '$location', '$mdDialog', 'shareLink', 'shareTitle', 'rpSettingsService', rpShareEmailDialogCtrl]);

	function rpShareEmailDialogCtrl($scope, $location, $mdDialog, shareLink, shareTitle, rpSettingsService) {
		$scope.animations = rpSettingsService.settings.animations;

		console.log('[rpShareEmailDialogCtrl] shareLink: ' + shareLink);
		console.log('[rpShareEmailDialogCtrl] shareTitle: ' + shareTitle);

		$scope.shareLink = shareLink || null;
		$scope.shareTitle = shareTitle || null;

		$scope.dialog = true;

		var deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function () {
			$mdDialog.hide();
		});

		$scope.$on('$destroy', function () {
			deregisterLocationChangeSuccess();
		});
	}
})();