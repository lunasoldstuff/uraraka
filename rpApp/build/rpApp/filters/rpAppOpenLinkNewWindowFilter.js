'use strict';

(function () {
	'use strict';

	angular.module('rpApp').filter('rpAppOpenLinkNewWindowFilter', [rpAppOpenLinkNewWindowFilter]);

	function rpAppOpenLinkNewWindowFilter() {
		return function (html) {
			if (html) {
				return html.replace(/&lt;a/g, '&lt;a target="_blank"');
			}
		};
	}
})();