(function() {
	'use strict';
	angular.module('rpMessageCompose').controller('rpMessageComposeDialogCtrl', [
		'$scope',
		'$location',
		'$mdDialog',
		'rpAppSettingsService',
		'shareLink',
		'shareTitle',
		rpMessageComposeDialogCtrl
	]);

	function rpMessageComposeDialogCtrl(
		$scope,
		$location,
		$mdDialog,
		rpAppSettingsService,
		shareLink,
		shareTitle
	) {
		$scope.animations = rpAppSettingsService.settings.animations;

		console.log('[rpMessageComposeDialogCtrl] shareLink: ' + shareLink);
		$scope.shareLink = shareLink || null;
		$scope.shareTitle = shareTitle || null;

		$scope.dialog = true;

		//Close the dialog if user navigates to a new page.
		var deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function() {
			$mdDialog.hide();
		});

		$scope.$on('$destroy', function() {
			deregisterLocationChangeSuccess();
		});

	}
})();