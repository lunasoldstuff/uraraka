'use strict';

var rpOpenNewControllers = angular.module('rpOpenNewControllers', []);

rpOpenNewControllers.controller('rpOpenNewButtonCtrl', [
	'$scope',
	'$window',
	function (
		$scope,
		$window
	) {

		$scope.open = function (e) {
			var article = $scope.isComment ? $filter('rp_name_to_id36')($scope.post.data.link_id) : $scope.post.data.id;
			var subreddit = $scope.post.data.subreddit;

			var url = '/r/' + subreddit + '/comments/' + article;

			$window.open(url);
		}

	}
]);