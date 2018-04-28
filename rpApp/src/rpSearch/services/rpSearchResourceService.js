(function() {
	'use strict';
	angular.module('rpSearch').factory('rpSearchResourceService', [
		'$resource',
		rpSearchResourceService
	]);

	function rpSearchResourceService($resource) {
		return $resource('/api/search/:sub', {
			sub: 'all',
			sort: 'relevance',
			after: '',
			before: '',
			restrict_sr: true,
			t: 'all',
			type: 'sr',
			limit: 24
		});
	}
})();