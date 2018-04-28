(function() {
	'use strict';
	angular.module('rpGotoSubreddit').controller('rpGotoSubredditCtrl', [
		'$scope',
		rpGotoSubredditCtrl
	]);

	function rpGotoSubredditCtrl($scope) {
		console.log('[rpGotoSubredditCtrl] load');
		$scope.isGotoSubredditOpen = false;

		$scope.toggleGotoSubredditOpen = function(e) {
			console.log('[rpGotoSubredditCtrl] toggleGotoSubredditOpen()');
			$scope.isGotoSubredditOpen = !$scope.isGotoSubredditOpen;
		};

	}
})();