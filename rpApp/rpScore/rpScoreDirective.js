(function() {
	'use strict';
	angular.module('rpScore').directive('rpScore', rpScoreDirective);

	/**
	 * Directive for score components
	 * requires 
	 * score,
	 * redditId of the post
	 * boolean likes whether the user likes the post
	 */
	function rpScoreDirective() {
		return {
			restrict: 'E',
			templateUrl: 'rpScore.html',
			controller: 'rpScoreCtrl',
			scope: {
				score: '=',
				redditId: '=',
				likes: '='
			}
		};
	}

})();