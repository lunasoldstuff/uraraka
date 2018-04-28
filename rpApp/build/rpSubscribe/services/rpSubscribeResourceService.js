'use strict';

(function () {
	'use strict';

	angular.module('rpSubscribe').factory('rpSubbscribeResourceService', ['$resource', rpSubbscribeResourceService]);

	function rpSubbscribeResourceService($resource) {
		return $resource('/api/uauth/subscribe');
	}
})();