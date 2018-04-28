'use strict';

(function () {
	'use strict';

	angular.module('rpSettings').factory('rpSettingsResourceService', ['$resource', rpSettingsResourceService]);

	function rpSettingsResourceService($resource) {
		return $resource('/settingsapi');
	}
})();