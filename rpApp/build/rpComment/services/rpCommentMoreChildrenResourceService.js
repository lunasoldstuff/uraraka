'use strict';

(function () {
	'use strict';

	angular.module('rpComment').factory('rpCommentMoreChildrenResourceService', ['$resource', rpCommentMoreChildrenResourceService]);

	function rpCommentMoreChildrenResourceService($resource) {
		return $resource('/api/morechildren', {
			sort: 'confidence'
		});
	}
})();