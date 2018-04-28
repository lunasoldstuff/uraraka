'use strict';

(function () {
	'use strict';

	angular.module('rpApp').factory('rpAppRedditApiResourceService', ['$resource', rpAppRedditApiResourceService]);

	function rpAppRedditApiResourceService($resource) {
		return $resource('/api/generic');
	}
})();