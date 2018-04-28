(function() {
	'use strict';
	angular.module('rpShare').factory('rpShareEmailResourceService', [
		'$resource',
		rpShareEmailResourceService
	]);

	function rpShareEmailResourceService($resource) {
		return $resource('/mail/share');
	}
})();