'use strict';

/* App Module */

var redditPlusApp = angular.module('redditPlusApp', [
  'ngRoute',
  'ngMaterial',
  'angularMoment',
  'redditPlusControllers',
  'redditPlusFilters',
  'redditPlusServices'
]);

redditPlusApp.constant('angularMomentConfig', {
  preprocess: 'unix',
  timezone: 'utc'
});

redditPlusApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/r/:sub', {
        templateUrl: 'partials/subredditPosts',
        controller: 'subredditPostsCtrl'
      }).
      when('/', {
        templateUrl: 'partials/subredditPosts',
        controller: 'indexCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
      $locationProvider.html5Mode(true);
  }]);

redditPlusApp.directive('rpPost', function(){
  return {
    restrict: 'E',
    templateUrl: 'partials/rpPost'
  };
});