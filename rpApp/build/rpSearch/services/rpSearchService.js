'use strict';

(function () {
	'use strict';

	angular.module('rpSearch').factory('rpSearchService', ['$rootScope', 'rpAppLocationService', 'rpToastService', 'rpAppRedditApiService', rpSearchService]);

	function rpSearchService($rootScope, rpAppLocationService, rpToastService, rpAppRedditApiService) {

		var rpSearchService = {};

		rpSearchService.params = {
			q: "",
			sub: "all",
			type: "link",
			sort: "relevance",
			t: "all",
			after: "",
			limit: 8
		};

		rpSearchService.search = function (callback) {
			console.log('[rpSearchService] search() rpSearchService.params: ' + JSON.stringify(rpSearchService.params));

			if (rpSearchService.params.q) {

				rpAppRedditApiService.redditRequest('get', '/r/$sub/search', {
					$sub: rpSearchService.params.sub,
					q: rpSearchService.params.q,
					limit: rpSearchService.params.limit,
					after: rpSearchService.params.after,
					before: "",
					restrict_sr: rpSearchService.params.restrict_sr,
					sort: rpSearchService.params.sort,
					t: rpSearchService.params.t,
					type: rpSearchService.params.type

				}, function (data) {

					if (data.responseError) {
						rpToastService('something went wrong with your search request', "sentiment_dissatisfied");
						callback(data, null);
					} else {
						callback(null, data);
					}
				});
			} else {
				callback(null, null);
			}
		};

		return rpSearchService;
	}
})();