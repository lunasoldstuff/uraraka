'use strict';

/* Controllers */

var redditPlusControllers = angular.module('redditPlusControllers', []);

redditPlusControllers.controller('subPostsCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    // $scope.posts = Reddit.get({sub: $routeParams.sub}, function(posts){
      $http.get('/api/' + $routeParams.sub).success(function(data){
        $scope.posts = data;
      });
  }
]);

redditPlusControllers.controller('indexCtrl', ['$scope', '$http',
  function($scope, $http) {
  		console.log("indexCtrl");
      $http.get('/api/all').success(function(data){
        $scope.posts = data;
      });
  }
]);

redditPlusControllers.controller('sidebarSubredditsCtrl', ['$scope', '$http', 
  function($scope, $http){
    $http.get('/api/subreddits').success(function(data){
        $scope.subs = data;
      });
}]);