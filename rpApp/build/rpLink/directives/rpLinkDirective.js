'use strict';

(function () {
	'use strict';

	angular.module('rpLink').directive('rpLink', ['$templateCache', rpLink]);

	function rpLink($templateCache) {
		return {
			restrict: 'E',
			templateUrl: 'rpLink/views/rpLink.html',
			controller: 'rpLinkCtrl',
			scope: {
				post: '=',
				parentCtrl: '=',
				identity: '=',
				showSub: '='

			}
		};
	}
})();