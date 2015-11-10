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
		$scope.propsAuthor = $scope.post.data.author;
		$scope.propsId = $scope.post.data.id;

		// console.log('[rpCommentsCtrl] $scope.props: ' + JSON.stringify($scope.props));
		
		$scope.testCommentsCtrl = function() {
			console.log('[rpCommentsCtrl] test success!');
		};


		$scope.collapseChildren = function(comment) {
			comment.childrenCollapsed = true;
		};
		
		$scope.expandChildren = function(comment) {
			comment.childrenCollapsed = false;
		};




	}
]);