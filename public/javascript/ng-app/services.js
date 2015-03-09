'use strict';

/* Services */

var redditPlusServices = angular.module('redditPlusServices', ['ngResource']);

/*
	[auth] Get User information
 */
redditPlusServices.factory('identityService', ['$resource', 
	function($resource){
		return $resource('/api/user/me', {}, {
			query: {method: 'GET', params: {}, isArray:false}
		});
	}
]);

/*
	[auth] Get subreddits for authenticated user.
 */
redditPlusServices.factory('SubredditsUser', ['$resource', 
	function($resource){
		return $resource('/api/user/subreddits', {}, {
      		query: {method:'GET', params:{}, isArray:true}
    	});
	}
]);

/*
	Gets posts for a given subreddit, defaults to r/all.
 */
redditPlusServices.factory('Posts', ['$resource', 
  function($resource){
    return $resource('/api/subreddit/:sub/:sort', {}, {
      query: {method:'GET', params:{sub: 'all', sort:'hot'}, isArray:true}
    });
  }
]);

/*
	Get list of popular subreddits
 */
redditPlusServices.factory('Subreddits', ['$resource', 
	function($resource){
		return $resource('/api/subreddits', {}, {
      		query: {method:'GET', params:{}, isArray:true}
    	});
	}
]);

/*
	Facillitates communication between toolbarCtrl and indexCtrl to
	change the title on page load.
 */
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

redditPlusServices.factory('subredditService', ['$rootScope', 
	function($rootScope){
		var subredditService = {};
		subredditService.subreddit = 'all';
		subredditService.prepSubredditChange = function(_subreddit){
			subredditService.subreddit = _subreddit;
			$rootScope.$broadcast('handleSubredditChange');
		};

		return subredditService;
	}
]);

/*
	Gets an imgur albums information... [not working currently]
 */
redditPlusServices.factory('imgurAlbumService', ['$resource', 
  function($resource){
    return $resource('https://api.imgur.com/3/album/:id', {}, {
      query: {method:'GET', params: {}, isArray:false, headers: {'Authorization': 'Client-ID a912803498adcd4'}}
    });
  }
]);

redditPlusServices.factory('tweetService', ['$resource', 
  function($resource){

  	return $resource('/twitter/status/:id', {}, {
  		query: {method:'GET', params: {}, isArray:false }
  	});

    // return $resource('https://api.twitter.com/1.1/statuses/oembed.json', {}, {
    //   query: {method:'GET', params: {}, isArray:false, 
    //   	headers: {
    //   			'Authorization': 'OAuth oauth_consumer_key="Tvp9esaa7nSxhQ8xtnqIBgu3s", oauth_nonce="689775adbf0f3413c4e1ebc805c139c0", oauth_signature="fck2LW9rG8sRq0ht0FlVxI1vbY8%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1425916656", oauth_token="72023528-6xdiz4IKLedFqMnBL5zdX0UHYaEGz68CyehbXU46s", oauth_version="1.0"',
    //   			'Access-Control-Allow-Origin': '*'
    //   		}
    //   	}
    // });
  }
]);




// redditPlusServices.factory('imgurAlbumService', ['$resource', '$log',
// 	function($resource, $log) {
// 		return $resource('http')
// 	}
// ]);