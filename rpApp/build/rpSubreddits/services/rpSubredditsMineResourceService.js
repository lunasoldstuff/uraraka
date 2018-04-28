'use strict';

(function () {
	'use strict';

	angular.module('rpSubreddits').factory('rpSubredditsMineResourceService', ['$resource', rpSubredditsMineResourceService]);

	function rpSubredditsMineResourceService($resource) {
		return $resource('/api/uauth/subreddits/mine/:where', {
			where: 'subscriber',
			limit: 50,
			after: ""
		});
	}
})();