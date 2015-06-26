'use strict';

/* App Module */

var rpApp = angular.module('rpApp', [
	'ngRoute',
	'ngMaterial',
	'ngAnimate',
	'ngSanitize',
	'infinite-scroll',
	'linkify',
	'angularMoment',
	'RecursionHelper',
	'ng-mfb',
	
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
	'rpProgressControllers',
	'rpCaptchaControllers',
	'rpSettingsControllers'
]);

// rpApp.config(function($rootScopeProvider) {
// 	$rootScopeProvider.digestTtl(15);
// });


/*
	Uncomment to enable digest cycle timer
 */

// rpApp.run(['$rootScope', function($rootScope) {
//       var $oldDigest = $rootScope.$digest;
//       var $newDigest = function() {
//           console.time("$digest");
//           $oldDigest.apply($rootScope);
//           console.timeEnd("$digest");
//       };
//       $rootScope.$digest = $newDigest;
//   }]);


rpApp.constant('angularMomentConfig', {
	preprocess: 'unix',
	timezone: 'utc'
});

rpApp.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider.
			
			when('/settings', {
				templateUrl: 'partials/rpSettings',
				controller: 'rpSettingsCtrl'
			})

			.when('/message', {
				templateUrl: 'partials/rpMessage',
				controller: 'rpMessageCtrl'
			})
			
			.when('/message/compose', {
				templateUrl: 'partials/rpMessageCompose',
				controller: 'rpMessageComposeCtrl'
			})
			
			.when('/message/:where', {
				templateUrl: 'partials/rpMessage',
				controller: 'rpMessageCtrl'
			})

			.when('/u/:username', {
				templateUrl: 'partials/rpUser',
				controller: 'rpUserCtrl'
			})

			.when('/u/:username/:where', {
				templateUrl: 'partials/rpUser',
				controller: 'rpUserCtrl'
			})

			.when('/user/:username', {
				templateUrl: 'partials/rpUser',
				controller: 'rpUserCtrl'
			})

			.when('/user/:username/:where', {
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

			.when('/:sort', {
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

rpApp.config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
		// .primaryPalette('blue')
		// If you specify less than all of the keys, it will inherit from the
		// default shades
		.accentPalette('deep-orange');
});

rpApp.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
}]);
