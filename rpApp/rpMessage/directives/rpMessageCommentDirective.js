(function() {
	'use strict';
	angular.module('rpMessage').directive('rpMessageComment', ['$compile',
		'$rootScope',
		'$templateCache',
		'RecursionHelper',
		rpMessageComment
	]);

	function rpMessageComment(
		$compile,
		$rootScope,
		$templateCache,
		RecursionHelper
	) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				parentCtrl: '=',
				message: '=',
				depth: '=',
				identity: '=',
			},
			template: $templateCache.get('rpMessage/views/rpMessageComment.html'),
			compile: function(element) {
				return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn) {

				});
			},
			controller: 'rpMessageCommentCtrl'
		};
	}
})();