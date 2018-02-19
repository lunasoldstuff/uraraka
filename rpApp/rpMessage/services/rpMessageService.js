(function() {
	'use strict';
	angular.module('rpMessage').factory('rpMessageService', [
		'rpAppRedditApiService',
		'rpToastService',
		rpMessageService
	]);

	function rpMessageService(rpAppRedditApiService, rpToastService) {

		return function(where, after, limit, callback) {
			console.log('[rpMessageService] request messages.');

			rpAppRedditApiService.redditRequest('listing', '/message/$where', {
				$where: where,
				after: after,
				limit: limit

			}, function(data) {

				if (data.responseError) {
					rpToastService("something went wrong retrieving your messages", "sentiment_dissatisfied");
					callback(data, null);
				} else {
					callback(null, data);
				}

			});

		};
	}
})();