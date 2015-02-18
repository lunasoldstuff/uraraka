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

    $scope.setTitle = function(_title) {
      $scope.title = _title;
    }
  }
]);

redditPlusControllers.controller('subredditPostsCtrl', ['$scope', '$routeParams', 'Posts',
  function($scope, $routeParams, Posts) {
    Posts.get({sub: $routeParams.sub}, function(data){
        $scope.posts = data;
      });
      // AppCtrl.setTitle($routeParams.sub);
  }
]);

redditPlusControllers.controller('indexCtrl', ['$scope', '$http',
  function($scope, $http) {
      $http.get('/api/subreddit/all').success(function(data){
        $scope.posts = data;
      });
      // setTitle("all");
  }
]);

redditPlusControllers.controller('sidenavSubredditsCtrl', ['$scope', 'Subreddits',
  function($scope, Subreddits){
    // $http.get('/api/subreddits').success(function(data){
        // $scope.subs = data;
     // });

    // $scope.subs = Subreddits.get({sub: 'sub'}, function(data){
    //     $scope.subs = data;
    // });

    // Subreddits.query(function(data){
    //   $scope.subs = data;
    // });

    $scope.subs = Subreddits.query();
  }
]);