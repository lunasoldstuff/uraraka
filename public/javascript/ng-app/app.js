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
	'redditPlusControllers',
	'redditPlusFilters',
	'redditPlusDirectives',
	'redditPlusServices',
	'rpUtilServices',
	'rpMediaControllers'
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
			
			when('/r/:subreddit/comments/:article/:comment', {
				templateUrl: 'partials/rpComments',
				controller: 'rpCommentsCtrl'
			}).

			when('/r/:subreddit/comments/:article', {
				templateUrl: 'partials/rpComments',
				controller: 'rpCommentsCtrl'
			}).

			when('/r/:sub/:sort', {
				templateUrl: 'partials/rpPosts',
				controller: 'postsCtrl'
			}).

			when('/r/:sub', {
				templateUrl: 'partials/rpPosts',
				controller: 'postsCtrl'
			}).

			when('/', {
				templateUrl: 'partials/rpPosts',
				controller: 'postsCtrl'
			}).

			otherwise({
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
