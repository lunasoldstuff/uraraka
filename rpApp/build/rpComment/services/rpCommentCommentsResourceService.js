'use strict';

(function () {
	'use strict';

	angular.module('rpComment').factory('rpCommentCommentsResourceService', ['$resource', rpCommentCommentsResourceService]);

	function rpCommentCommentsResourceService($resource) {
		return $resource('/api/comments/:subreddit/:article', {
			sort: 'confidence'
		});
	}
})();