(function() {
	'use strict';
	angular.module('rpSubreddits').factory('rpSubredditsAboutResourceService', [
		'$resource',
		rpSubredditsAboutResourceService
	]);

	function rpSubredditsAboutResourceService($resource) {
		return $resource('/api/about/:sub');
	}
})();