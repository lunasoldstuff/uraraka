(function() {
	'use strict';
	angular.module('rpComment').factory('rpCommentChildrenService', [
		'rpAppRedditApiService',
		rpCommentChildrenService
	]);

	function rpCommentChildrenService(rpAppRedditApiService) {
		return function(sort, link_id, children, callback) {
			console.log('[rpCommentChildrenService] request more children');

			rpAppRedditApiService.redditRequest('get', '/api/morechildren', {
				sort: sort,
				link_id: link_id,
				children: children
			}, function(data) {

				if (data.responseError) {
					callback(data, null);
				} else {
					callback(null, data);
				}

			});
		};
	}
})();