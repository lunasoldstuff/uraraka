'use strict';

(function () {
	'use strict';

	angular.module('rpSubmit').controller('rpSubmitRulesCtrl', ['$scope', 'rpSubredditsService', rpSubmitRulesCtrl]);

	function rpSubmitRulesCtrl($scope, rpSubredditsService) {
		console.log('[rpSubmitRulesCtrl] load');
		console.log('[rpSubmitRulesCtrl] $scope.subreddit: ' + $scope.subreddit);
		$scope.loading = true;

		rpSubredditsService.aboutSub($scope.subreddit, function (data) {
			console.log('[rpSubmitRulesCtrl] data: ' + data);
			$scope.loading = false;
		});
	}
})();