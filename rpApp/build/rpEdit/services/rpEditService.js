'use strict';

(function () {
	'use strict';

	angular.module('rpEdit').factory('rpEditService', ['rpToastService', 'rpAppRedditApiService', rpEditService]);

	function rpEditService(rpToastService, rpAppRedditApiService) {
		return function (text, thing_id, callback) {
			console.log('[rpEditService]');

			rpAppRedditApiService.redditRequest('post', '/api/editusertext', {
				text: text,
				thing_id: thing_id
			}, function (data) {

				if (data.responseError) {
					rpToastService("something went wrong trying to edit your post", "sentiment_dissatisfied");
					callback(data, null);
				} else {
					rpToastService("post editted", "sentiment_satisfied");
					callback(null, data);
				}
			});
		};
	}
})();