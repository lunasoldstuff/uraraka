'use strict';

(function () {
	'use strict';

	angular.module('rpReply').controller('rpReplyFormCtrl', ['$scope', '$timeout', 'rpCommentService', rpReplyFormCtrl]);

	function rpReplyFormCtrl($scope, $timeout, rpCommentService) {
		console.log('[rpReplyFormCtrl] load.');

		$scope.submitting = false;
		$scope.formatting = false;

		$scope.submit = function () {
			console.log('[rpReplyFormCtrl] submit()');
			$scope.submitting = true;

			rpCommentService($scope.redditId, $scope.reply, function (err, data) {

				$scope.submitting = false;
				//was not causing issues, but added for good measure.
				$timeout(angular.noop, 0);

				if (err) {
					console.log('[rpReplyFormCtrl] err.');
				} else {
					//successful reply

					$scope.reply = "";
					$scope.replyForm.$setUntouched();
					$scope.replyForm.$setPristine();

					if ($scope.parentCtrl.completeReplying) {
						$scope.parentCtrl.completeReplying(data, $scope.post);
					}
				}
			});
		};

		$scope.toggleFormatting = function () {
			$scope.formatting = !$scope.formatting;
		};
	}
})();