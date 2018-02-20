(function() {
	'use strict';
	angular.module('rpScore').filter('rpScoreKiloFilter', [rpScoreKiloFilter]);

	function rpScoreKiloFilter() {
		return function(s) {
			if (s > 10000) {
				s = s / 1000;
				s = s.toPrecision(3);
				s = s + 'k';
			}
			return s;
		};
	}
})();