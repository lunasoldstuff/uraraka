'use strict';

(function () {
	'use strict';

	angular.module('rpMessage').factory('rpMessageReadAllService', ['$timeout', 'rpAppRedditApiService', rpMessageReadAllService]);

	function rpMessageReadAllService($timeout, rpAppRedditApiService) {
		return function (callback) {

			var retryAttempts = 9;
			var wait = 2000;

			attemptReadAllMessages();

			function attemptReadAllMessages() {

				if (retryAttempts > 0) {

					$timeout(rpAppRedditApiService.redditRequest('post', '/api/read_all_messages', {}, function (data) {
						if (data.responseError) {
							retryAttempts -= 1;
							attemptReadAllMessages();
							callback(data, null);
						} else {
							retryAttempts = 3;
							callback(null, data);
						}
					}), wait * 10 - retryAttempts);
				}
			}
		};
	}
})();