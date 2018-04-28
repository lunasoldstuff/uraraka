'use strict';

(function () {
	'use strict';

	angular.module('rpMessage').directive('rpMessageComment', ['$compile', '$rootScope', '$templateCache', 'RecursionHelper', rpMessageComment]);

	function rpMessageComment($compile, $rootScope, $templateCache, RecursionHelper) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				parentCtrl: '=',
				message: '=',
				depth: '=',
				identity: '='
			},
			template: $templateCache.get('rpMessage/rpMessage/views/rpMessageComment.html'),
			compile: function compile(element) {
				return RecursionHelper.compile(element, function (scope, iElement, iAttrs, controller, transcludeFn) {});
			},
			controller: 'rpMessageCommentCtrl'
		};
	}
})();