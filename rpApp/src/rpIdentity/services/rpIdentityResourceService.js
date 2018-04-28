(function() {
	'use strict';
	angular.module('rpIdentity').factory('rpIdentityResourceService', [
		'$resource',
		rpIdentityResourceService
	]);

	function rpIdentityResourceService($resource) {
		return $resource('/api/uauth/me');
	}
})();