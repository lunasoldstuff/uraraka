(function() {
	'use strict';
	angular.module('rpPost').factory('rpPostFrontpageResourceService', [
		'$resource',
		rpPostFrontpageResourceService
	]);

	function rpPostFrontpageResourceService($resource) {
		return $resource('/api/:sort', {
			sort: 'hot',
			after: 'none',
			t: 'none',
			limit: 'limit'
		});
	}
})();