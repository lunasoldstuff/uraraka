'use strict';

(function () {
	'use strict';

	angular.module('rpPost').factory('rpPostResourceService', ['$resource', rpPostResourceService]);

	function rpPostResourceService($resource) {
		return $resource('/api/subreddit/:sub/:sort');
	}
})();