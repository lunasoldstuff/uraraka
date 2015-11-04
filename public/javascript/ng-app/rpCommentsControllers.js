'use strict';

var rpCommentsControllers = angular.module('rpCommentsControllers', []);

//cid: The current comment id
//used to set style on the focuessed comment.

rpCommentsControllers.controller('rpCommentsCtrl',
	['$scope',
	function(
		$scope
	) {

		console.log('[rpCommentsCtrl] loaded.');
		// console.log('[rpCommentsCtrl] $scope.comments[0].data: ' + JSON.stringify($scope.comments[0].data));

		$scope.props = {};

		$scope.props.identityName = $scope.identity ? $scope.identity.name : "";
		$scope.props.commentId = $scope.commentId || "";
		$scope.props.postAuthor = $scope.post.data.author;

		console.log('[rpCommentsCtrl] $scope.props: ' + JSON.stringify($scope.props));
		







	}
]);