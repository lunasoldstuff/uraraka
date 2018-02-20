(function() {
	'use strict';
	angular.module('rpApp').filter('rpAppAddElipsisFilter', [rpAppAddElipsisFilter]);

	function rpAppAddElipsisFilter() {
		return function(s) {
			if (s.length >= 500) return s + '...';
			return s;
		};
	}
})();