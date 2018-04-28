'use strict';

(function () {
	'use strict';

	angular.module('rpOpenNew').controller('rpOpenNewCtrl', ['$scope', '$window', '$filter', rpOpenNewCtrl]);

	function rpOpenNewCtrl($scope, $window, $filter) {

		$scope.open = function (e) {
			var article = $scope.isComment ? $filter('rpAppNameToId36Filter')($scope.post.data.link_id) : $scope.post.data.id;
			var subreddit = $scope.post.data.subreddit;

			var url = '/r/' + subreddit + '/comments/' + article;

			$window.open(url);
		};
	}
})();