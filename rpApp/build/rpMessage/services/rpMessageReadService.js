'use strict';

(function () {
	'use strict';

	angular.module('rpMessage').factory('rpMessageReadService', ['rpAppRedditApiService', rpMessageReadService]);

	function rpMessageReadService(rpAppRedditApiService) {
		return function (message, callback) {

			rpAppRedditApiService.redditRequest('post', '/api/read_message', {
				id: message
			}, function (data) {
				if (data.responseError) {
					console.log('[rpMessageReadService] err');
					callback(data, null);
				} else {
					callback(null, data);
				}
			});
		};
	}
})();