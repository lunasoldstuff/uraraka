'use strict';

(function () {
	'use strict';

	angular.module('rpMessage').directive('rpMessageSidenav', [rpMessageSidenav]);

	function rpMessageSidenav() {
		return {
			restrict: 'E',
			templateUrl: 'rpMessage/rpMessage/views/rpMessageSidenav.html',
			controller: 'rpMessageSidenavCtrl'
		};
	}
})();