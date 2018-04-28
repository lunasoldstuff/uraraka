(function() {
	'use strict';
	angular.module('rpSave').factory('rpSaveUnsaveResourceService', [
		'$resource',
		rpSaveUnsaveResourceService
	]);

	function rpSaveUnsaveResourceService($resource) {
		return $resource('/api/uauth/unsave/');
	}
})();