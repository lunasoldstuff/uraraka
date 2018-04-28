(function() {
	'use strict';
	angular.module('rpLink').filter('rpLinkIsCommentFilter', [rpLinkIsCommentFilter]);

	function rpLinkIsCommentFilter() {
		return function(name) {
			return (name.substr(0, 3) === 't1_');
		};
	}
})();