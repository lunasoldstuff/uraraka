'use strict';

(function () {
	'use strict';

	angular.module('rpMessage').factory('rpMessageResourceService', ['$resource', rpMessageResourceService]);

	function rpMessageResourceService($resource) {
		return $resource('/api/uauth/message/:where', {
			after: 'none'
		});
	}
})();