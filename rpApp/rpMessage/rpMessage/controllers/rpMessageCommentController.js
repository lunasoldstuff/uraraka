(function() {
	'use strict';
	angular.module('rpMessage').controller('rpMessageCommentCtrl', [
		'$scope',
		'$filter',
		'$mdDialog',
		'rpIdentityService',
		rpMessageCommentCtrl
	]);

	function rpMessageCommentCtrl($scope, $filter, $mdDialog, rpIdentityService, rpAppLocationService) {

		if ($scope.identity) {
			console.log('[rpMessageCommentCtrl] $scope.identity.name: ' + $scope.identity.name);

		}


		// rpIdentityService.getIdentity(function(data) {
		// 	$scope.identity = data;
		// });

		$scope.childDepth = $scope.depth + 1;

		$scope.isReplying = false;

		/**
		 * CONTROLLER API
		 * */

		$scope.thisController = this;

		this.completeReplying = function(data, post) {
			console.log('[rpMessageCommentCtrl] this.completeReplying(), $scope.message.kind: ' + $scope.message.kind);

			this.isReplying = false;

			if ($scope.message.kind === 't1') {
				$scope.comments = data.json.data.things;

			} else if ($scope.message.kind === 't4') {

				if (!$scope.message.data.replies) {

					$scope.message.data.replies = {
						data: {
							children: data.json.data.things
						}
					};

				} else {
					$scope.message.data.replies.data.children.push(data.json.data.things[0]);
				}

			}

		};

		this.completeDeleting = function(id) {
			this.isDeleting = false;
			console.log('[rpMessageCtrl] this.completeDeleting()');

			for (var i = 0; i < $scope.$parent.messages.length; i++) {
				if ($scope.$parent.messages[i].data.name === id) {
					$scope.$parent.messages.splice(i, 1);
				}
			}

		};

	}

})();