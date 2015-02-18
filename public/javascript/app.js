'use strict';

/* App Module */

var redditPlusApp = angular.module('redditPlusApp', [
  'ngRoute',
  'ngMaterial',
  'redditPlusControllers',
  'redditPlusFilters'
  // 'redditPlusServices'
]);

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