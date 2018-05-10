(function () {
  'use strict';


  function rpSubredditsCtrl(
    $scope,
    $rootScope,
    $timeout,
    $q,
    $mdSidenav,
    rpSubredditsService,
    rpAppLocationService

  ) {
    $scope.subs = rpSubredditsService.getSubs();
    $scope.isSubredditsOpen = false;

    $scope.toggleSubredditsOpen = function () {
      console.log('[rpSubredditsCtrl] toggleSubredditsOpen()');
      $scope.isSubredditsOpen = !$scope.isSubredditsOpen;
    };

    $scope.pinnedSubs = [{
      name: 'frontpage',
      url: '/'
    }, {
      name: 'all',
      url: '/r/all/'
    }, {
      name: 'random',
      url: '/r/random/'
    }, {
      name: 'reddupco',
      url: '/r/reddupco'
    }];

    $scope.openSubreddit = function (e, url) {
      console.log('[rpSubredditsCtrl] openSubreddit, url: ' + url);
      $timeout(function () {
        rpAppLocationService(e, url, '', true, false);
      }, 350);
    };

    $scope.$on('$destroy', function () {});
  }

  angular.module('rpSubreddits')
    .controller('rpSubredditsCtrl', [
      '$scope',
      '$rootScope',
      '$timeout',
      '$q',
      '$mdSidenav',
      'rpSubredditsService',
      'rpAppLocationService',
      rpSubredditsCtrl
    ]);
}());
