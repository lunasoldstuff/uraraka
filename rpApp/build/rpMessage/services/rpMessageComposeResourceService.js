'use strict';

(function () {
	'use strict';

	angular.module('rpMessage').factory('rpMessageComposeResourceService', ['$resource', rpMessageComposeResourceService]);

	function rpMessageComposeResourceService($resource) {
		return $resource('/api/uauth/compose');
	}
})();