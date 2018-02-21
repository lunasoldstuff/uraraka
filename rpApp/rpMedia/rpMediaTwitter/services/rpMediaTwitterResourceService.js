(function() {
	'use strict';
	angular.module('rpMedia').factory('rpMediaTwitterResourceService', [
		'$resource',
		rpMediaTwitterResourceService
	]);

	function rpMediaTwitterResourceService($resource) {
		return $resource('/twitter/status/:id');
	}
})();