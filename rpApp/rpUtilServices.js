'use strict';

var rpUtilServices = angular.module('rpUtilServices', []);









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