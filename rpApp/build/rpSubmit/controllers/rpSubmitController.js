'use strict';

(function () {
	'use strict';

	angular.module('rpSubmit').controller('rpSubmitCtrl', ['$scope', '$rootScope', '$routeParams', 'rpAppTitleChangeService', rpSubmitCtrl]);

	function rpSubmitCtrl($scope, $rootScope, $routeParams, rpAppTitleChangeService) {
		console.log('[rpSubmitCtrl] $scope.isDialog: ' + $scope.isDialog);

		$scope.formatting = false;

		$scope.toggleFormatting = function () {
			$scope.formatting = !$scope.formatting;
		};

		if (!$scope.isDialog) {
			$rootScope.$emit('rp_hide_all_buttons');
			$rootScope.$emit('rp_tabs_hide');
			rpAppTitleChangeService('submit to reddit', true, true);
		}

		if (!$scope.isDialog && $routeParams.sub) {
			$scope.subreddit = $routeParams.sub;
		}

		console.log('[rpSubmitCtrl] $scope.subreddit: ' + $scope.subreddit);
	}
})();