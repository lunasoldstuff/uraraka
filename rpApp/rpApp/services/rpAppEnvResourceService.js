(function() {
	'use strict';
	angular.module('rpApp').factory('rpAppEnvResourceService', [
		'$resrouce',
		rpAppEnvResourceService
	]);

	function rpAppEnvResourceService($resource) {
		return $resource('/auth/env');
	}
})();