'use strict';

/* App Module */

var redditPlusApp = angular.module('redditPlusApp', [
  'ngRoute',
  'redditPlusControllers',
  'redditPlusFilters'
  // 'redditPlusServices'
]);

redditPlusApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/r/:sub', {
        templateUrl: 'partials/subPosts',
        controller: 'subPostsCtrl'
      }).
      when('/', {
        templateUrl: 'partials/subPosts',
        controller: 'indexCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
      $locationProvider.html5Mode(true);
  }]);