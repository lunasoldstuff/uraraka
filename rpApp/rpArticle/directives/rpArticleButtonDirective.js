(function() {
	'use strict';
	angular.module('rpArticle').directive('rpArticleButton', rpArticleButton);

	function rpArticleButton() {
		return {
			restrict: 'E',
			templateUrl: 'rpArticleButton.html',
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