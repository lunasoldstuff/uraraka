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
	  query: {method:'GET', params:{sub: '', sort:'hot', after: "none", t: "none"}, isArray:true}
	});
  }
]);

redditPlusServices.factory('voteService', ['$resource',
  function($resource){
	return $resource('/api/user/vote/');
  }
]);

redditPlusServices.factory('saveService', ['$resource',
  function($resource){
	return $resource('/api/user/save/');
  }
]);

redditPlusServices.factory('unsaveService', ['$resource',
  function($resource){
	return $resource('/api/user/unsave/');
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
		titleChangeService.title = 'reddit: the frontpage of the internet';
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
		subredditService.subreddit = '';
		subredditService.prepSubredditChange = function(_subreddit){
			subredditService.subreddit = _subreddit;
			$rootScope.$broadcast('handleSubredditChange');
		};
		return subredditService;
	}
]);

/*
	Gets an imgur albums information.
 */
redditPlusServices.factory('imgurAlbumService', ['$resource',
  function($resource){
	return $resource('https://api.imgur.com/3/album/:id', {}, {
	  query: {method:'GET', params: {}, isArray:false, headers: {'Authorization': 'Client-ID a912803498adcd4'}}
	});
  }
]);

redditPlusServices.factory('imgurGalleryService', ['$resource',
  function($resource){
	return $resource(' https://api.imgur.com/3/gallery/:id', {}, {
	  query: {method:'GET', params: {}, isArray:false, headers: {'Authorization': 'Client-ID a912803498adcd4'}}
	});
  }
]);

redditPlusServices.factory('tweetService', ['$resource',
  function($resource){

	return $resource('/twitter/status/:id', {}, {
		query: {method:'GET', params: {}, isArray:false }
	});

  }
]);
