(function() {
	'use strict';
	angular.module('rpComment').filter('rpCommentLoadMediaFilter', [rpCommentLoadMediaFilter]);

	function rpCommentLoadMediaFilter() {
		return function(commentBody) {
			// console.log('[rpFilters rpCommentLoadMediaFilter] typeof commentBody: ' + typeof commentBody);
			// console.log('[rpFilters rpCommentLoadMediaFilter] commentBody: ' + JSON.stringify(commentBody));
			return commentBody.replace(/<a/g, "<a class=\"rp-comment-media\"");

		};
	}
})();