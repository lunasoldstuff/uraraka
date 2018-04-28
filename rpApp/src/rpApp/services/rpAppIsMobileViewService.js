(function() {
	'use strict';

	angular.module('rpApp').factory('rpAppIsMobileViewService', [
		'$window',
		rpAppIsMobileViewService
	]);

	function rpAppIsMobileViewService($window) {
		console.log('[rpAppIsMobileViewService]');

		var rpAppIsMobileViewService = {};

		//maximum size for mobile view
		var layoutXs = 600;

		rpAppIsMobileViewService.isMobileView = function() {
			console.log('[rpAppIsMobileViewService] isMobileView: ' + ($window.innerWidth <= layoutXs));
			return $window.innerWidth <= layoutXs;
		};

		return rpAppIsMobileViewService;

	}

})();