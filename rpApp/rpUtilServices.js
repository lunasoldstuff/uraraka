'use strict';

var rpUtilServices = angular.module('rpUtilServices', []);









rpUtilServices.factory('rpPostsUtilService', [
	'$rootScope',
	'rpPostsResourceService',
	'rpFrontpageResourceService',
	'rpToastService',
	'rpAppLocationService',
	'rpAppRedditApiService',

	function(
		$rootScope,
		rpPostsResourceService,
		rpFrontpageResourceService,
		rpToastService,
		rpAppLocationService,
		rpAppRedditApiService

	) {

		return function(sub, sort, after, t, limit, callback) {

			console.log('[rpPostsUtilService] limit: ' + limit);

			if (sub) {


				rpAppRedditApiService.redditRequest('listing', 'r/$subreddit/$sort', {
					$subreddit: sub,
					t: t,
					limit: limit,
					after: after,
					$sort: sort
				}, function(data) {

					console.log('[rpPostsUtilService] data: ' + data);

					if (data.responseError) {

						console.log('[rpPostsUtilService] responseError data.status: ' + data.status);

						/*
						Random.
						Redirect to new sub
						*/

						// console.log('[rpPostsUtilService] error data: ' + JSON.stringify(data));

						if (data.status === 302) {

							var randomSubRe = /https:\/\/oauth\.reddit\.com\/r\/([\w]+)*/i;
							var groups = randomSubRe.exec(data.body);

							if (groups[1]) {
								console.log('[rpPostsUtilService] open random sub: ' + groups[1]);
								rpAppLocationService(null, '/r/' + groups[1], '', true, true);

							}

						} else {
							rpToastService("something went wrong retrieving posts", "sentiment_dissatisfied");
							rpAppLocationService(null, '/error/' + data.status, '', true, true);
							callback(data, null);
						}

					} else {

						if (sub === 'random') {
							console.log('[rpPostsUtilService] random subreddit, redirecting to ' + data.get.data.children[0].data.subreddit);
							rpAppLocationService(null, '/r/' + data.get.data.children[0].data.subreddit, '', true, true);

						} else {
							console.log('[rpPostsUtilService] no err returning posts to controller, sub: ' + sub);
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
]);

rpUtilServices.factory('rpMessageUtilService', ['rpAppRedditApiService', 'rpToastService',
	function(rpAppRedditApiService, rpToastService) {

		return function(where, after, limit, callback) {
			console.log('[rpMessageUtilService] request messages.');

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
]);

rpUtilServices.factory('rpCommentsUtilService', ['rpAppRedditApiService',
	function(rpAppRedditApiService) {
		return function(subreddit, article, sort, comment, context, callback) {
			console.log('[rpCommentsUtilService] request comments');
			console.log('[rpCommentsUtilService] subreddit: ' + subreddit);
			console.log('[rpCommentsUtilService] article: ' + article);
			console.log('[rpCommentsUtilService] sort: ' + sort);
			console.log('[rpCommentsUtilService] comment: ' + comment);
			console.log('[rpCommentsUtilService] context: ' + context);

			var params = {
				$subreddit: subreddit,
				$article: article,
				comment: comment,
				context: context,
				showedits: true,
				showmore: true,
				sort: sort,
			};

			if (angular.isUndefined(comment) || comment === "") {
				params.depth = 7;
			}
			console.log('[rpCommentsUtilService] depth: ' + params.depth);

			rpAppRedditApiService.redditRequest('get', '/r/$subreddit/comments/$article', params,
				function(data) {

					if (data.responseError) {
						console.log('[rpCommentService] responseError: ' + JSON.stringify(data));
						callback(data, null);
					} else {
						callback(null, data);
					}

				});

		};
	}
]);

rpUtilServices.factory('rpMoreChildrenUtilService', ['rpAppRedditApiService',
	function(rpAppRedditApiService) {
		return function(sort, link_id, children, callback) {
			console.log('[rpMoreChildrenUtilService] request more children');

			rpAppRedditApiService.redditRequest('get', '/api/morechildren', {
				sort: sort,
				link_id: link_id,
				children: children
			}, function(data) {

				if (data.responseError) {
					callback(data, null);
				} else {
					callback(null, data);
				}

			});
		};
	}
]);



rpUtilServices.factory('rpUserUtilService', ['rpAppRedditApiService', 'rpToastService',
	function(rpAppRedditApiService, rpToastService) {
		return function(username, where, sort, after, t, limit, callback) {
			console.log('[rpUserUtilService] request user');

			rpAppRedditApiService.redditRequest('listing', '/user/$username/$where', {
				$username: username,
				$where: where,
				sort: sort,
				after: after,
				t: t,
				limit: limit
			}, function(data) {
				if (data.responseError) {
					rpToastService("something went wrong retrieving the user's posts", "sentiment_dissatisfied");
					callback(data, null);
				} else {
					callback(null, data);
				}
			});

		};
	}
]);

rpUtilServices.factory('rpAppRedditApiService', ['rpByIdResourceService',
	function(rpAppRedditApiService) {
		return function(name, callback) {
			rpAppRedditApiService.redditRequest('get', '/by_id/$name', {
				$name: name
			}, function(data) {
				if (data.responseError) {
					callback(data, null);
				} else {
					callback(null, data);
				}
			});
		};
	}
]);

rpUtilServices.factory('rpReadAllMessagesUtilService', ['$timeout', 'rpAppRedditApiService',
	function($timeout, rpAppRedditApiService) {
		return function(callback) {

			var retryAttempts = 9;
			var wait = 2000;

			attemptReadAllMessages();

			function attemptReadAllMessages() {

				if (retryAttempts > 0) {

					$timeout(rpAppRedditApiService.redditRequest('post', '/api/read_all_messages', {}, function(data) {
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
]);

rpUtilServices.factory('rpReadMessageUtilService', ['rpAppRedditApiService',
	function(rpAppRedditApiService) {
		return function(message, callback) {

			rpAppRedditApiService.redditRequest('post', '/api/read_message', {
				id: message
			}, function(data) {
				if (data.responseError) {
					console.log('[rpReadMessageUtilService] err');
					callback(data, null);
				} else {
					callback(null, data);
				}
			});
		};

	}
]);