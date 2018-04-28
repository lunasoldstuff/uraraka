'use strict';

(function () {
	'use strict';

	angular.module('rpSearch').filter('rpSearchContainsSpacesFilter', [rpSearchContainsSpacesFilter]);

	function rpSearchContainsSpacesFilter() {
		return function (s) {
			var spacesRe = /\s/;
			console.log('[rpSearchContainsSpacesFilter] s: ' + s + ', spacesRe.test(s): ' + spacesRe.test(s));
			return spacesRe.test(s);
			//alternative
			// return s.indexOf(' ') !== -1;
		};
	}
})();