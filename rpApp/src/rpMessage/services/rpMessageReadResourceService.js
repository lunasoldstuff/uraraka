(function() {
	'use strict';
	angular.module('rpApp').factory('rpMessageReadResourceService', [
		'$resource',
		rpMessageReadResourceService
	]);

	function rpMessageReadResourceService($resource) {
		return $resource('/api/uauth/read_message');
	}
})();