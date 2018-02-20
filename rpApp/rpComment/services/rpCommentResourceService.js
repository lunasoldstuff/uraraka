(function() {
	'use strict';
	angular.module('rpComment').factory('rpCommentResourceService', [
		'$resource',
		rpCommentResourceService
	]);

	function rpCommentResourceService($resource) {
		return $resource('/api/comments/:subreddit/:article', {
			sort: 'confidence'
		});
	}
})();