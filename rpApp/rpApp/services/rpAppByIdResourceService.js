(function() {
	'use strict';
	angular.module('rpApp').factory('rpAppByIdResourceService', [
		'$resource',
		rpAppByIdResourceService
	]);

	function rpAppByIdResourceService($resource) {
		return $resource('/api/by_id/:name');
	}
})();