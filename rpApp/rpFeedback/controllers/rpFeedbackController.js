(function() {
	'use strict';
	angular.module('rpFeedback').controller('rpFeedbackCtrl', [
		'$scope',
		'$rootScope',
		'rpTitleChangeService',
		rpFeedbackCtrl
	]);

	function rpFeedbackCtrl($scope, $rootScope, rpTitleChangeService) {
		console.log('[rpFeedbackCtrl] load');

		if (!$scope.isDialog) {
			$rootScope.$emit('rp_hide_all_buttons');
			$rootScope.$emit('rp_tabs_hide');
			rpTitleChangeService('send feedback', true, true);
		}

		$scope.isFeedback = true;

		$scope.formatting = false;
		$scope.toggleFormatting = function() {
			$scope.formatting = !$scope.formatting;
		};
	}
})();