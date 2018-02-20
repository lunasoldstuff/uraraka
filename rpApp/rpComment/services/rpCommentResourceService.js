(function() {
	'use strict';
	angular.module('').factory('rpCommentResourceService', [
		'$resource',
		rpCommentResourceService
	]);

	function rpCommentResourceService($resource) {
		return $resource('/api/uauth/comment');
	}
})();