'use strict';

var rpLinkControllers = angular.module('rpLinkControllers', []);

rpLinkControllers.controller('rpLinkCtrl', [
	'$scope',
	'$filter',
	'$mdDialog',
	'rpLocationUtilService',
	function (
		$scope,
		$filter,
		$mdDialog,
		rpLocationUtilService
	) {

		// console.log('[rpLinkCtrl] $scope.$parent.$index: ' + $scope.$parent.$index);
		// console.log('[rpLinkCtrl] $scope.post.isAd: ' + $scope.post.isAd);

		if (angular.isUndefined($scope.post.isAd)) {
			$scope.post.isAd = false;
		}

		if ($scope.post.isAd === false) {
			$scope.isComment = $filter('rp_is_comment')($scope.post.data.name);
			// console.log('[rpLinkCtrl] $scope.isComment: ' + $scope.isComment);

			//Dodgy because depends on $scope.identity being set by a parentCtrl like rpPostsCtrl or
			//rpUserCtrl.
			//Could change to look up identity here instead, but then you are doing it for every single link so..
			//This way works, you just have to be careful and make sure the parentCtrl is actually looking up the
			//identity And setting it on $scope.identity.
			$scope.isMine = $scope.identity ? $scope.post.data.author === $scope.identity.name : false;

			/**
			 * CONTOLLER API
			 */
			$scope.thisController = this;

			this.completeDeleting = function (id) {
				console.log('[rpLinkCtrl] completeDeleting()');
				$scope.parentCtrl.completeDeleting(id);

			};

			this.completeReplying = function (data) {
				console.log('[rpLinkCtrl] completeReplying()');
				$scope.postComment = data.json.data.things[0];
				$scope.post.data.num_comments++;
			};

		}

	}
]);