'use strict';

(function () {
	'use strict';

	angular.module('rpFeedback').controller('rpFeedbackCtrl', ['$scope', '$rootScope', 'rpAppTitleChangeService', rpFeedbackCtrl]);

	function rpFeedbackCtrl($scope, $rootScope, rpAppTitleChangeService) {
		console.log('[rpFeedbackCtrl] load');

		if (!$scope.isDialog) {
			$rootScope.$emit('rp_hide_all_buttons');
			$rootScope.$emit('rp_tabs_hide');
			rpAppTitleChangeService('send feedback', true, true);
		}

		$scope.isFeedback = true;

		$scope.formatting = false;
		$scope.toggleFormatting = function () {
			$scope.formatting = !$scope.formatting;
		};
	}
})();