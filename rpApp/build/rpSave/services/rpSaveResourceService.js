'use strict';

(function () {
	'use strict';

	angular.module('rpSave').factory('rpSaveResourceService', ['$resource', rpSaveResourceService]);

	function rpSaveResourceService($resource) {
		return $resource('/api/uauth/save/');
	}
})();