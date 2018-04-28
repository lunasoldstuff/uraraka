(function() {
	'use strict';
	angular.module('rpLink').filter('rpLinkOpenInTabFilter', [rpLinkOpenInTabFilter]);

	function rpLinkOpenInTabFilter() {
		return function(commentBody) {
			return commentBody.replace(/<a/g, '<a target="_blank"');

		};
	}
})();