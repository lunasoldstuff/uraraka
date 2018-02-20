(function() {
	'use strict';
	angular.module('rpScore').factory('rpScoreVoteResourceService', [
		'$resource',
		rpScoreVoteResourceService
	]);

	function rpScoreVoteResourceService($resource) {
		return $resource('/api/uauth/vote/');
	}
})();