(function() {
	'use strict';
	angular.module('rpSearch').directive('rpSearchSidenav', [rpSearchSidenav]);

	function rpSearchSidenav() {
		return {
			restrict: 'E',
			templateUrl: 'rpSearch/views/rpSearchSidenav.html',
			controller: 'rpSearchSidenavCtrl'
		};
	}
})();