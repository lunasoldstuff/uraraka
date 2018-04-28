'use strict';

(function () {
	'use strict';

	angular.module('rpMessage').filter('rpMessageLinkIdFilter', [rpMessageLinkIdFilter]);

	function rpMessageLinkIdFilter() {
		return function (link) {

			if (link) {

				var linkIdRe = /^\/r\/(?:[\w]+)\/comments\/([\w]+)/i;
				var groups = linkIdRe.exec(link);

				return groups[1];
			}
			return 0;
		};
	}
})();