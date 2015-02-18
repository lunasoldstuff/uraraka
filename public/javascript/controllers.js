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

redditPlusControllers.controller('toolbarCtrl', ['$scope', '$log', 'titleChangeService',
  function($scope, $log, titleChangeService) {
    $scope.toolbarTitle = 'reddit+';
    $scope.$on('handleTitleChange', function(e, d) {
      $scope.toolbarTitle = titleChangeService.title;
    });
  }
]);

redditPlusControllers.controller('subredditPostsCtrl', ['$scope', '$routeParams', '$log', 'Posts', 'titleChangeService',
  function($scope, $routeParams, $log, Posts, titleChangeService) {
    Posts.query({sub: $routeParams.sub}, function(data){
        $scope.posts = data;
        titleChangeService.prepTitleChange('r/' + data[0].data.subreddit);
      });
  }
]);

redditPlusControllers.controller('indexCtrl', ['$scope', '$routeParams', 'Posts', 'titleChangeService',
  function($scope, $routeParams, Posts, titleChangeService) {
      $scope.posts = Posts.query(function(){
        titleChangeService.prepTitleChange('r/all');
      });
  }
]);

redditPlusControllers.controller('sidenavSubredditsCtrl', ['$scope', 'Subreddits',
  function($scope, Subreddits){
    $scope.subs = Subreddits.query();
  }
]);