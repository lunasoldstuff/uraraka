(function() {
	'use strict';
	angular.module('rpGild').factory('rpGildResourceService', [
		'$resource',
		rpGildResourceService
	]);

	function rpGildResourceService($resource) {
		return $resource('/api/uauth/gild');
	}
})();