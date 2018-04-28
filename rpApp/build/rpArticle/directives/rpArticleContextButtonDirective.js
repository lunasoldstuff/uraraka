'use strict';

(function () {
	'use strict';

	angular.module('rpArticle').directive('rpArticleContextButton', rpArticleContextButton);

	function rpArticleContextButton() {
		return {
			restrict: 'E',
			templateUrl: 'rpArticle/views/rpArticleContextButton.html',
			controller: 'rpArticleButtonCtrl',
			scope: {
				parentCtrl: '=',
				post: '=',
				isComment: '=',
				message: '='
			}
		};
	}
})();