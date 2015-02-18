'use strict';

/* Services */

var redditPlusServices = angular.module('redditPlusServices', ['ngResource']);

redditPlusServices.factory('Posts', ['$resource',
  function($resource){
    return $resource('/api/:sub', {}, {
      query: {method:'GET', params:{sub:'sub'}, isArray:true}
    });
  }
]);

redditPlusServices.factory('Subreddits', ['$resource', 
	function($resource){
		return $resource('/api/subreddits', {}, {
      		query: {method:'GET', params:{}, isArray:true}
    	});
	}
]);