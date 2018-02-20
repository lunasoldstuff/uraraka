(function() {
	'use strict';
	angular.module('').factory('rpSubmitResourceService', [
		'$resource',
		rpSubmitResourceService
	]);

	function rpSubmitResourceService($resource) {
		return $resource('/api/uauth/submit');
	}
})();