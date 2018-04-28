'use strict';

(function () {
	'use strict';

	angular.module('rpApp').factory('rpAppEnvResourceService', ['$resource', rpAppEnvResourceService]);

	function rpAppEnvResourceService($resource) {
		return $resource('/auth/env');
	}
})();