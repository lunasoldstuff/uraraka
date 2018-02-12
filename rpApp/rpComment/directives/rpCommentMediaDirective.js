(function() {
	'use strict';
	angular.module('rpComment').directive('rpCommentMedia', rpCommentMedia);

	function rpCommentMedia() {
		return {
			restrict: 'C',
			scope: {
				href: "@"
			},
			transclude: true,
			replace: true,
			templateUrl: 'rpComment/views/rpCommentMedia.html'

		};
	}

})();