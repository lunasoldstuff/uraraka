'use strict';

(function () {
	'use strict';

	angular.module('rpApp').filter('rpAppUnescapeEmbedFilter', ['$sce', rpAppUnescapeEmbedFilter]);

	function rpAppUnescapeEmbedFilter($sce) {
		return function (val) {
			if (typeof val !== 'undefined' && val !== '') {
				var return_val = angular.element('<div>' + val + '</div>').text();
				return $sce.trustAsHtml(return_val);
			}
		};
	}
})();