(function() {
	'use strict';
	angular.module('rpSettings').directive('rpSettingsSidenav', [rpSettingsSidenav]);

	function rpSettingsSidenav() {
		return {
			restrict: 'E',
			templateUrl: 'rpSettings/views/rpSettingsSidenav.html',
			controller: 'rpSettingsSidenavCtrl'
		};
	}
})();