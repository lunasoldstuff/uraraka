'use strict';

var rpUtilServices = angular.module('rpUtilServices', []);









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