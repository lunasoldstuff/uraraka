(function() {
	'use strict';

	angular.module('rpArticle').directive('rpArticle', rpArticle);

	function rpArticle() {
		return {
			restrict: 'C',
			templateUrl: 'rpArticle.html',
			controller: 'rpArticleCtrl',
			// replace: true,
			scope: {
				dialog: '=',
				post: '=',
				article: '=',
				subreddit: '=',
				comment: '=',
				animations: '='

			}
		};
	}

})();