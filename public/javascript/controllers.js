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



redditPlusControllers.controller('progressCtrl', ['$scope', '$rootScope', '$log', '$timeout',
  function($scope, $rootScope, $log, $timeout){
    $scope.value = 0.2;
    $scope.loading = true;
    var incTimeout = 0;

    $rootScope.$on('progressLoading', function(e, d){
      // $log.log('progressLoading');
      $scope.loading = true;
      set(0.2)
    });
    $rootScope.$on('progressComplete', function(e,d){
      // $log.log('progressComplete');
      set(100);
      $timeout(function(){
        $scope.loading = false;
      }, 600);
    });
    $rootScope.$on('progress', function(e, d){
      // $log.log('progress: ' + d.value);
      set(d.value);
    });

    function set(n) {
      if($scope.loading == false) return;
      $scope.value = n;

      $timeout.cancel(incTimeout);
      incTimeout = $timeout(function(){
        inc();
      }, 750);
    }


    function inc() {
      var rnd = 0;

        // TODO: do this mathmatically instead of through conditions

        var stat = $scope.value/100;
        if (stat >= 0 && stat < 0.25) {
          // Start out between 3 - 6% increments
          rnd = (Math.random() * (5 - 3 + 1) + 3) / 100;
        } else if (stat >= 0.25 && stat < 0.65) {
          // increment between 0 - 3%
          rnd = (Math.random() * 3) / 100;
        } else if (stat >= 0.65 && stat < 0.9) {
          // increment between 0 - 2%
          rnd = (Math.random() * 2) / 100;
        } else if (stat >= 0.9 && stat < 0.99) {
          // finally, increment it .5 %
          rnd = 0.005;
        } else {
          // after 99%, don't increment:
          rnd = 0;
        }
        // $log.log("RANDOM INC: " + rnd*1000);
        $scope.value += rnd*500;
    }
  }
]);

redditPlusControllers.controller('indexCtrl', ['$scope', '$routeParams', 'Posts', 'titleChangeService',
  function($scope, $routeParams, Posts, titleChangeService) {
      $scope.posts = Posts.query(function(){
        titleChangeService.prepTitleChange('r/all');
      });
  }
]);

redditPlusControllers.controller('sidenavSubredditsUserCtrl', ['$scope', 'SubredditsUser',
  function($scope, SubredditsUser){
    $scope.subs = SubredditsUser.query();
  }
]);

redditPlusControllers.controller('sidenavSubredditsCtrl', ['$scope', 'Subreddits',
  function($scope, Subreddits){
    $scope.subs = Subreddits.query();
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


redditPlusControllers.controller('imgurAlbumCtrl', ['$scope', '$log', '$routeParams', 'imgurAlbumService', 
  function($scope, $log, $routeParams, imgurAlbumService){
    var url = $scope.post.data.url;
    $log.log(url);
    var id = url.substring(url.lastIndexOf('/')+1);
    $log.log(id);
    // imgurAlbumService.query({id: id}, function(data){
    //     $scope.album = data;
    //   });
  }
]);

// redditPlusControllers.controller('imgurAlbumCtrl', ['$scope', '$routeParams', '$log', 'imgAlbumService', 
//   function($scope, $routeParams, $log, imgurAlbumService){
//     $log.log('[imgurAlbumCtrl]');
//   }
// ]);