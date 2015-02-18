'use strict';

/* Controllers */

var redditPlusControllers = angular.module('redditPlusControllers', []);

redditPlusControllers.controller('AppCtrl', ['$scope', '$timeout', '$mdSidenav',
  function($scope, $timeout, $mdSidenav) {
    $scope.toggleLeft = function() {
      $mdSidenav('left').toggle();
    };

    $scope.close = function() {
      $mdSidenav('left').close();
    }
  }
]);

redditPlusControllers.controller('subredditPostsCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    // $scope.posts = Reddit.get({sub: $routeParams.sub}, function(posts){
      $http.get('/api/subreddit/' + $routeParams.sub).success(function(data){
        $scope.posts = data;
      });
  }
]);

redditPlusControllers.controller('indexCtrl', ['$scope', '$http',
  function($scope, $http) {
      $http.get('/api/subreddit/all').success(function(data){
        $scope.posts = data;
      });
  }
]);

redditPlusControllers.controller('sidenavSubredditsCtrl', ['$scope', '$http', 
  function($scope, $http){
    $http.get('/api/subreddits').success(function(data){
        $scope.subs = data;
      });
}]);