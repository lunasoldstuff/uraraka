(function() {
	'use strict';
	angular.module('rpGotoSubreddit').controller('rpGotoSubredditCtrl', [
		'$scope',
		rpGotoSubredditCtrl
	]);

	function rpGotoSubredditCtrl($scope) {
		console.log('[rpGotoSubredditCtrl] load');
		$scope.isOpen = false;

		$scope.toggleOpen = function(e) {
			$scope.isOpen = !$scope.isOpen;
		};

	}
})();