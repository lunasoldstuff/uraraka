(function() {
	'use strict';
	angular.module('rpPost').factory('rpPostService', [
		'$rootScope',
		'rpPostResourceService',
		'rpFrontpageResourceService',
		'rpToastService',
		'rpAppLocationService',
		'rpAppRedditApiService',
		rpPostService
	]);

	function rpPostService(
		$rootScope,
		rpPostResourceService,
		rpFrontpageResourceService,
		rpToastService,
		rpAppLocationService,
		rpAppRedditApiService

	) {

		return function(sub, sort, after, t, limit, callback) {

			console.log('[rpPostService] limit: ' + limit);

			if (sub) {


				rpAppRedditApiService.redditRequest('listing', 'r/$subreddit/$sort', {
					$subreddit: sub,
					t: t,
					limit: limit,
					after: after,
					$sort: sort
				}, function(data) {

					console.log('[rpPostService] data: ' + data);

					if (data.responseError) {

						console.log('[rpPostService] responseError data.status: ' + data.status);

						/*
						Random.
						Redirect to new sub
						*/

						// console.log('[rpPostService] error data: ' + JSON.stringify(data));

						if (data.status === 302) {

							var randomSubRe = /https:\/\/oauth\.reddit\.com\/r\/([\w]+)*/i;
							var groups = randomSubRe.exec(data.body);

							if (groups[1]) {
								console.log('[rpPostService] open random sub: ' + groups[1]);
								rpAppLocationService(null, '/r/' + groups[1], '', true, true);

							}

						} else {
							rpToastService("something went wrong retrieving posts", "sentiment_dissatisfied");
							rpAppLocationService(null, '/error/' + data.status, '', true, true);
							callback(data, null);
						}

					} else {

						if (sub === 'random') {
							console.log('[rpPostService] random subreddit, redirecting to ' + data.get.data.children[0].data.subreddit);
							rpAppLocationService(null, '/r/' + data.get.data.children[0].data.subreddit, '', true, true);

						} else {
							console.log('[rpPostService] no err returning posts to controller, sub: ' + sub);
							callback(null, data);

						}


					}

				});





			} else {

				rpAppRedditApiService.redditRequest('listing', '/$sort', {
					$sort: sort,
					after: after,
					limit: limit,
					t: t
				}, function(data) {

					if (data.responseError) {
						rpToastService("something went wrong retrieving posts", "sentiment_dissatisfied");
						rpAppLocationService(null, '/error/' + 404, '', true, true);
						// rpAppLocationService(null, '/error/' + data.status, '', true, true);

						callback(data, null);

					} else {
						callback(null, data);

					}
				});

			}

		};
	}
})();