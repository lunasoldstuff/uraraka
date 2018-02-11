(function() {
	angular.module('rpApp').factory('rpIsMobileViewService', rpIsMobileViewService);

	function rpIsMobileViewService($window) {
		console.log('[rpIsMobileViewService]');

		var rpIsMobileViewService = {};

		//maximum size for mobile view
		var layoutXs = 600;

		rpIsMobileViewService.isMobileView = function() {
			console.log('[rpIsMobileViewService] isMobileView: ' + ($window.innerWidth <= layoutXs));
			return $window.innerWidth <= layoutXs;
		};

		return rpIsMobileViewService;

	}

})();