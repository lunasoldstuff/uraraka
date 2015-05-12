'use strict';

/* App Module */

var redditPlusApp = angular.module('redditPlusApp', [
	'ngRoute',
	'ngMaterial',
	'ngAnimate',
	'ngSanitize',
	'infinite-scroll',
	'linkify',
	'angularMoment',
	'RecursionHelper',
	
	'rpServices',
	'rpUtilServices',
	'rpResourceServices',

	'rpFilters',
	'rpDirectives',
	'rpMediaDirectives',
	
	'rpControllers',
	'rpPostControllers',
	'rpUserControllers',
	'rpMessageControllers',
	'rpCommentsControllers',
	'rpCommentControllers',
	'rpMediaControllers',
	'rpProgressControllers'
]);

// redditPlusApp.config(function($rootScopeProvider) {
// 	$rootScopeProvider.digestTtl(15);
// });


/*
	Uncomment to enable digest cycle timer
 */

// redditPlusApp.run(['$rootScope', function($rootScope) {
//       var $oldDigest = $rootScope.$digest;
//       var $newDigest = function() {
//           console.time("$digest");
//           $oldDigest.apply($rootScope);
//           console.timeEnd("$digest");
//       };
//       $rootScope.$digest = $newDigest;
//   }]);


redditPlusApp.constant('angularMomentConfig', {
	preprocess: 'unix',
	timezone: 'utc'
});

redditPlusApp.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider.
			
			when('/message', {
				templateUrl: 'partials/rpMessage',
				controller: 'rpMessageCtrl'
			})
			
			.when('/message/:where', {
				templateUrl: 'partials/rpMessage',
				controller: 'rpMessageCtrl'
			})

			.when('/u/:username', {
				templateUrl: 'partials/rpUser',
				controller: 'rpUserCtrl'
			})

			.when('/r/:subreddit/comments/:article/:comment', {
				templateUrl: 'partials/rpComments',
				controller: 'rpCommentsCtrl'
			})

			.when('/r/:subreddit/comments/:article', {
				templateUrl: 'partials/rpComments',
				controller: 'rpCommentsCtrl'
			})

			.when('/r/:sub/:sort', {
				templateUrl: 'partials/rpPosts',
				controller: 'rpPostsCtrl'
			})

			.when('/r/:sub', {
				templateUrl: 'partials/rpPosts',
				controller: 'rpPostsCtrl'
			})

			.when('/', {
				templateUrl: 'partials/rpPosts',
				controller: 'rpPostsCtrl'
			})

			.otherwise({
				templateUrl: 'partials/404'
			});


			$locationProvider.html5Mode(true);
	}
]);

redditPlusApp.config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
		// .primaryPalette('blue')
		// If you specify less than all of the keys, it will inherit from the
		// default shades
		.accentPalette('deep-orange');
});
