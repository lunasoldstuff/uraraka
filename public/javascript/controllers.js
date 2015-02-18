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
    };
  }
]);

redditPlusControllers.controller('toolbarController', ['$scope', '$rootScope',
  function($scope, $rootScope) {
    $scope.toolbarTitle = 'reddit+';
    // $rootScope.$on('handleTitleChange', function(event, _title) {
    //   $scope.toolbarTitle = _title;
    // });
  }
]);

redditPlusControllers.controller('subredditPostsCtrl', ['$scope', '$routeParams', '$log', 'Posts', 
  function($scope, $routeParams, $log, Posts) {
    $log.log("$routeParams.sub: " + $routeParams.sub);
    Posts.query({sub: $routeParams.sub}, function(data){
        $scope.posts = data;
        // $scope.$emit('titleChange', data[0].data.subreddit);
        // $log.log(data[0].data.subreddit);
        // $rootscope.$broadcast('titleChange', data[0].data.subreddit);
        // $scope.$log.log('subredditPostCtrl');
        // sharedService.prepTitleChange(data[0].data.subreddit);
      });
  }
]);

redditPlusControllers.controller('indexCtrl', ['$scope', '$routeParams', 'Posts',
  function($scope, $routeParams, Posts) {
      // $http.get('/api/subreddit/all').success(function(data){
      //   $scope.posts = data;
      // });
      $scope.posts = Posts.query();

      // get({sub: "all"}, function(data){
      //   $scope.posts = data;
      // });
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