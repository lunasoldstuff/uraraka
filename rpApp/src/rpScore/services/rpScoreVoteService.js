(function() {
	'use strict';
	angular.module('rpScore').factory('rpScoreVoteService', [
		'rpAppRedditApiService',
		rpScoreVoteService
	]);

	function rpScoreVoteService(rpAppRedditApiService) {

		return function(id, dir, callback) {

			rpAppRedditApiService.redditRequest('post', '/api/vote', {
				id: id,
				dir: dir
			}, function(data) {
				if (data.responseError) {
					callback(data, null);
				} else {
					callback(null, data);
				}
			});

		};

	}
})();