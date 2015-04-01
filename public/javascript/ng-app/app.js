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
	'redditPlusControllers',
	'redditPlusFilters',
	'redditPlusDirectives',
	'redditPlusServices'
]);

redditPlusApp.run(['$rootScope', function($rootScope) {
      var $oldDigest = $rootScope.$digest;
      var $newDigest = function() {
          console.time("$digest");
          $oldDigest.apply($rootScope);
          console.timeEnd("$digest");
      };
      $rootScope.$digest = $newDigest;
  }]);


redditPlusApp.constant('angularMomentConfig', {
	preprocess: 'unix',
	timezone: 'utc'
});

redditPlusApp.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider.
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
		.primaryPalette('blue')
		// If you specify less than all of the keys, it will inherit from the
		// default shades
		.accentPalette('deep-orange');
});


/*
	Doesnt work must have all colors defined.
 */
// redditPlusApp.config(function($mdThemingProvider) {
//   $mdThemingProvider.definePalette('redditBlue', {
//     '400': 'eff7ff',
//     '500': 'cee3f8',
//     '600': '336699',
//     'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
//                                         // on this palette should be dark or light
//     'contrastDarkColors': ['600'],
//     'contrastLightColors': ['400']    // could also specify this if default was 'dark'
//   });

//   $mdThemingProvider.definePalette('redditOrange', {
//     '400': 'ff8b60',
//     '500': 'ff4500',
//     '600': 'ff5700',
//     'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
//                                         // on this palette should be dark or light
//     'contrastDarkColors': ['600'],
//     'contrastLightColors': ['400']    // could also specify this if default was 'dark'
//   });
//   $mdThemingProvider.theme('default')
//     .primaryPalette('redditBlue').accentPalette('redditOrange');
// });
