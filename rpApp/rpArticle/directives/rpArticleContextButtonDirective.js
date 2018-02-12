(function() {
	'use strict';
	angular.module('rpArticle').directive('rpArticleContextButton', rpArticleContextButton);

	function rpArticleContextButton() {
		return {
			restrict: 'E',
			templateUrl: 'rpArticleContextButton.html',
			controller: 'rpArticleButtonCtrl',
			scope: {
				parentCtrl: '=',
				post: '=',
				isComment: '=',
				message: '=',
			}
		};
	}
})();