'use strict';

(function () {
	'use strict';

	angular.module('rpMessage').factory('rpMessageReadAllResourceService', ['$resource', rpMessageReadAllResourceService]);

	function rpMessageReadAllResourceService($resource) {
		return $resource('/api/uauth/read_all_messages');
	}
})();