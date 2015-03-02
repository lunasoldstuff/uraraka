'use strict';

/* Services */

var redditPlusServices = angular.module('redditPlusServices', ['ngResource']);

redditPlusServices.factory('Posts', ['$resource', 
  function($resource){
    return $resource('/api/subreddit/:sub', {}, {
      query: {method:'GET', params:{sub: 'all'}, isArray:true}
    });
	// return $resource('/api/subreddit/:sub').query();
  }
]);

redditPlusServices.factory('imgurAlbumService', ['$resource', 
  function($resource){
    return $resource('/api/imgur/album/:id', {}, {
      query: {method:'GET', params: {}, isArray:true}
    });
  }
]);

// phonecatServices.factory('Phone', ['$resource',
//   function($resource){
//     return $resource('phones/:phoneId.json', {}, {
//       query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
//     });
//   }]);


redditPlusServices.factory('SubredditsUser', ['$resource', 
	function($resource){
		return $resource('/api/user/subreddits', {}, {
      		query: {method:'GET', params:{}, isArray:true}
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

redditPlusServices.factory('titleChangeService', ['$rootScope', 
	function($rootScope){
		var titleChangeService = {};
		titleChangeService.title = '';
		
		titleChangeService.prepTitleChange = function(_title){
			titleChangeService.title = _title;
			$rootScope.$broadcast('handleTitleChange');
		};

		return titleChangeService;
	}
]);

// redditPlusServices.factory('imgurAlbumService', ['$resource', '$log',
// 	function($resource, $log) {
// 		return $resource('http')
// 	}
// ]);