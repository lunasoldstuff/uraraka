(function() {
	'use strict';
	angular.module('rpGild').factory('rpGildService', [rpGildService]);

	function rpGildService(rpToastService, rpAppRedditApiService) {
		return function(fullname, callback) {

			rpAppRedditApiService.redditRequest('post', '/api/v1/gold/gild/$fullname', {
				$fullname: fullname
			}, function(data) {

				if (data.responseError) {
					var body = JSON.parse(data.body);
					console.log('[rpGildService] body.reason: ' + body.reason);
					if (body.reason === 'INSUFFICIENT_CREDDITS') {
						rpToastService("you've got no creddits in your reddit account", "sentiment_dissatisfied");
					} else {
						rpToastService("something went wrong trying to gild this post", "sentiment_dissatisfied");
					}
					callback(data, null);
				} else {
					rpToastService("gilded post is gilded", "sentiment_satisfied");
					callback(null, data);
				}

			});
		};
	}
})();