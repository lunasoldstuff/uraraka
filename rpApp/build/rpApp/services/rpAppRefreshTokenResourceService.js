'use strict';

(function () {
	'use strict';

	angular.module('rpApp').factory('rpAppRefreshTokenResourceService', ['$resource', rpAppRefreshTokenResourceService]);

	function rpAppRefreshTokenResourceService($resource) {
		return $resource('/auth/token');
	}
})();