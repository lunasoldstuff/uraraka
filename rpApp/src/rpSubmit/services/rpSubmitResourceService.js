(function() {
	'use strict';
	angular.module('rpSubmit').factory('rpSubmitResourceService', [
		'$resource',
		rpSubmitResourceService
	]);

	function rpSubmitResourceService($resource) {
		return $resource('/api/uauth/submit');
	}
})();