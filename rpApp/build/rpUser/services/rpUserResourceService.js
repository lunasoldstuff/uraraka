'use strict';

(function () {
	'use strict';

	angular.module('rpUser').factory('rpUserResourceService', ['$resource', rpUserResourceService]);

	function rpUserResourceService($resource) {
		return $resource('/api/user/:username/:where', {
			username: '',
			where: 'overview',
			sort: 'new',
			after: 'none',
			t: 'none'
		});
	}
})();