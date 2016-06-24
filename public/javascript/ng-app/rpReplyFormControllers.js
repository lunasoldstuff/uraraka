'use strict';

var rpReplyFormControllers = angular.module('rpReplyFormControllers', []);

rpReplyFormControllers.controller('rpReplyButtonCtrl', ['$scope',
	function($scope) {

		$scope.parentCtrl.isReplying = false;

		$scope.toggleReplying = function() {
			console.log('[rpReplyButtonCtrl], toggleReplying()');
			$scope.parentCtrl.isReplying = !$scope.parentCtrl.isReplying;
		};

	}
]);

rpReplyFormControllers.controller('rpReplyFormCtrl', ['$scope', 'rpCommentUtilService',
	function($scope, rpCommentUtilService) {

		$scope.submitting = false;

		$scope.submit = function() {
			console.log('[rpReplyFormCtrl] submit()');
			$scope.submitting = true;

			rpCommentUtilService($scope.redditId, $scope.reply, function(err, data) {

				$scope.submitting = false;
				//was not causing issues, but added for good measure.
				$timeout(angular.noop, 0);

				if (err) {
					console.log('[rpReplyFormCtrl] err.');

				} else { //successful reply

					$scope.reply = "";
					$scope.replyForm.$setUntouched();
					$scope.replyForm.$setPristine();

					if ($scope.parentCtrl.completeReplying) {
						$scope.parentCtrl.completeReplying(data, $scope.post);
					}

				}

			});


		};

	}

]);
