(function() {
	'use strict';
	angular.module('rpArticle').directive('rpArticleContextButtonMenu', rpArticleContextButtonMenu);

	function rpArticleContextButtonMenu() {
		return {
			restrict: 'E',
			templateUrl: 'rpArticleContextButtonMenu.html',
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