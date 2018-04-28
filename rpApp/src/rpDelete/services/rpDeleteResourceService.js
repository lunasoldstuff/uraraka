(function() {
	'use strict';
	angular.module('rpDelete').factory('rpDeleteResourceService', [
		'$resource',
		rpDeleteResourceService
	]);

	function rpDeleteResourceService($resource) {
		return $resource('/api/uauth/del/');
	}
})();