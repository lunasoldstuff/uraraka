(function() {
	'use strict';
	angular.module('rpFeedback').controller('rpFeedbackDialogCtrl', [
		'$scope',
		'rpSettingsService',
		rpFeedbackDialogCtrl
	]);

	function rpFeedbackDialogCtrl($scope, rpSettingsService) {
		console.log('[rpFeedbackDialogCtrl] load');
		$scope.isDialog = true;
		$scope.animations = rpSettingsService.settings.animations;
	}
})();