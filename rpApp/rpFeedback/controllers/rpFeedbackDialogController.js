(function() {
	'use strict';
	angular.module('rpFeedback').controller('rpFeedbackDialogCtrl', [
		'$scope',
		'rpAppSettingsService',
		rpFeedbackDialogCtrl
	]);

	function rpFeedbackDialogCtrl($scope, rpAppSettingsService) {
		console.log('[rpFeedbackDialogCtrl] load');
		$scope.isDialog = true;
		$scope.animations = rpAppSettingsService.settings.animations;
	}
})();