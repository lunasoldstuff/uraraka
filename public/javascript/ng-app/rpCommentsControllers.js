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

		console.log('[rpCommentsCtrl] $scope.identityName: ' + $scope.identityName);

		$scope.toggleReply = function(replying) {
			console.log('[rpCommentsCtrl] toggleReply(), replying: ' + replying);
			replying = !replying;
		};
		
		this.toggleReplyThis = function(replying) {
			console.log('[rpCommentsCtrl] toggleReplyThis(), replying: ' + replying);
			replying = !replying;
		};




	}
]);