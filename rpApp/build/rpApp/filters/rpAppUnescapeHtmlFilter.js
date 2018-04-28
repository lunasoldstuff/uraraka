'use strict';

(function () {
	'use strict';

	angular.module('rpApp').filter('rpAppUnescapeHtmlFilter', ['$sce', rpAppUnescapeHtmlFilter]);

	function rpAppUnescapeHtmlFilter($sce) {
		return function (val) {
			// console.log('[rpAppUnescapeHtmlFilter]');
			return angular.element('<div>' + $sce.trustAsHtml(val) + '</div>').text();
		};
	}
})();