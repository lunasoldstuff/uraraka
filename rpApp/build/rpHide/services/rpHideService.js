'use strict';

(function () {
	'use strict';

	angular.module('rpHide').factory('rpHideService', ['rpAppRedditApiService', rpHideService]);

	function rpHideService(rpAppRedditApiService) {
		return function (id, isHidden, callback) {
			var uri = isHidden ? '/api/unhide' : '/api/hide';

			rpAppRedditApiService.redditRequest('post', uri, {
				id: id
			}, function (data) {
				if (data.responseError) {
					callback(data, null);
				} else {
					callback(null, data);
				}
			});
		};
	}
})();