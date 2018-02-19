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