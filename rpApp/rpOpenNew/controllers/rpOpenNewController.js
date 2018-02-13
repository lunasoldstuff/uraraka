(function() {
	'use strict';
	angular.module('rpOpenNew').controller('rpOpenNewCtrl', ['$scope',
		'$window',
		'$filter',
		rpOpenNewCtrl
	]);

	function rpOpenNewCtrl(
		$scope,
		$window,
		$filter
	) {

		$scope.open = function(e) {
			var article = $scope.isComment ? $filter('rp_name_to_id36')($scope.post.data.link_id) : $scope.post.data.id;
			var subreddit = $scope.post.data.subreddit;

			var url = '/r/' + subreddit + '/comments/' + article;

			$window.open(url);
		};

	}
})();