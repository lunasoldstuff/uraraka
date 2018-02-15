(function() {
	'use strict';
	angular.module('rpSubreddits').directive('rpSubreddits', [rpSubreddits]);

	function rpSubreddits() {
		return {
			restrict: 'E',
			templateUrl: 'rpSubreddits/views/rpSubreddits.html',
			controller: 'rpSubredditsCtrl'
		};
	}

})();