(function() {
	'use strict';
	angular.module('rpReply').controller('rpReplyButtonCtrl', [
		'$scope',
		rpReplyButtonCtrl
	]);

	function rpReplyButtonCtrl($scope) {

		$scope.parentCtrl.isReplying = false;

		$scope.toggleReplying = function() {
			console.log('[rpReplyButtonCtrl], toggleReplying()');
			$scope.parentCtrl.isReplying = !$scope.parentCtrl.isReplying;
		};

	}

})();