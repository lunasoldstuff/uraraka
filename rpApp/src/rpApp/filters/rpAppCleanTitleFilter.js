(function() {
	'use strict';
	angular.module('rpApp').filter('rpAppCleanTitleFilter', [rpAppCleanTitleFilter]);

	function rpAppCleanTitleFilter() {
		return function(text) {
			if (text) {
				text = text
					.replace(/&amp;/g, '&')
					.replace(/&lt;/g, "<")
					.replace(/&gt;/g, ">")
					.replace(/&nbsp;/gi, ' ');
			}
			return text;
		};
	}
})();