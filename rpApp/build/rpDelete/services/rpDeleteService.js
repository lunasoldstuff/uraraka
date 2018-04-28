'use strict';

(function () {
	'use strict';

	angular.module('rpDelete').factory('rpDeleteService', ['rpAppAuthService', 'rpToastService', 'rpAppRedditApiService', rpDeleteService]);

	function rpDeleteService(rpAppAuthService, rpToastService, rpAppRedditApiService) {

		return function (name, type, callback) {
			console.log('[rpDeleteService] name: ' + name);
			console.log('[rpDeleteService] type: ' + type);

			var deleteEndpoint = type === 'message' ? '/api/del_msg' : '/api/del';

			rpAppRedditApiService.redditRequest('post', deleteEndpoint, {
				id: name
			}, function (data) {
				if (data.responseError) {
					rpToastService("something went wrong trying to delete your post", "sentiment_dissatisfied");
					callback(data, null);
				} else {
					rpToastService("post deleted", "sentiment_satisfied");
					callback(null, data);
				}
			});
		};
	}
})();