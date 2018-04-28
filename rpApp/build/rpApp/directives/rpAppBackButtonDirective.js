'use strict';

(function () {
	'use strict';

	angular.module('rpApp').directive('rpAppBackButton', ['$window', rpAppBackButton]);

	function rpAppBackButton($window) {
		return {
			restrict: 'A',
			link: function link(scope, elem, attrs) {
				elem.bind('click', function () {
					console.log('[rpBackButton] click()');
					$window.history.back();
				});
			}
		};
	}
})();