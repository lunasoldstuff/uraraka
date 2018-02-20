(function() {
	'use strict';
	angular.module('rpMedia').filter('rpMediaHttpsFilter', [rpMediaHttpsFilter]);

	function rpMediaHttpsFilter() {
		return function(url) {
			var httpRe = /^http:/;

			if (httpRe.test(url)) {
				url = url.replace(/^http:/, 'https:');
			}

			return url;
		};
	}
})();