(function() {
	'use strict';
	angular.module('rpSubmit').controller('rpSubmitRulesCtrl', [
		'$scope',
		'rpSubredditsUtilService',
		rpSubmitRulesCtrl
	]);

	function rpSubmitRulesCtrl(
		$scope,
		rpSubredditsUtilService
	) {
		console.log('[rpSubmitRulesCtrl] load');
		console.log('[rpSubmitRulesCtrl] $scope.subreddit: ' + $scope.subreddit);
		$scope.loading = true;

		rpSubredditsUtilService.aboutSub($scope.subreddit, function(data) {
			console.log('[rpSubmitRulesCtrl] data: ' + data);
			$scope.loading = false;
		});
	}
})();