(function() {
	'use strict';
	angular.module('rpEdit').factory('rpEditResourceService', [
		'$resource',
		rpEditResourceService
	]);

	function rpEditResourceService($resource) {
		return $resource('/api/uauth/editusertext');
	}
})();