(function() {
	'use strict';
	angular.module('rpApp').factory('rpAppRefreshTokenResourceService', [
		'$resrouce',
		rpAppRefreshTokenResourceService
	]);

	function rpAppRefreshTokenResourceService($resource) {
		return $resource('/auth/token');
	}

})();