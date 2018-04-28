(function() {
	'use strict';
	angular.module('rpDelete').factory('rpDeleteMessageResourceService', [
		'$resource',
		rpDeleteMessageResourceService
	]);

	function rpDeleteMessageResourceService($resource) {
		return $resource('/api/uauth/del_msg/');
	}
})();