(function() {
	'use strict';
	angular.module('rpSubreddits').factory('rpSubredditsResourceService', [
		'$resource',
		rpSubredditsResourceService
	]);

	function rpSubredditsResourceService($resource) {
		return $resource('/api/subreddits/:where', {
			where: 'default',
			limit: 50
		});
	}
})();