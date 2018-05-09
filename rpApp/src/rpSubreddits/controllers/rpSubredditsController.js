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
    var deregisterSubredditsUpdated;

    $scope.subs = [];
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

    deregisterSubredditsUpdated = $rootScope.$on('subreddits_updated', function () {
      $scope.subs = rpSubredditsService.subs;
      $timeout(angular.noop, 0);
    });

    function addBatch(first, last, subs) {
      console.log('[rpSubredditsCtrl] addBatch(), first: ' + first + ', last: ' + last + ', $scope.subs.length: ' +
        $scope.subs.length);

      if ($scope.subs.length > 0) {
        $scope.subs = Array.prototype.concat.apply($scope.subs, subs.slice(first, last));
      } else {
        $scope.subs = subs.slice(first, last);
      }

      // $timeout(angular.noop, 0);
    }

    function addSubsInBatches(subs, batchSize) {
      var addNextBatch;
      var addSubsAndRender = $q.when();
      console.log('[rpSubredditsCtrl] addSubsInBatches(), subs.length: ' + subs.length + ', batchSize: ' + batchSize);

      for (let i = 0; i < subs.length; i += batchSize) {
        addNextBatch = angular.bind(null, addBatch, i, Math.min(i + batchSize, subs.length), subs);
        addSubsAndRender = addSubsAndRender.then(addNextBatch);
      }

      return addSubsAndRender;
    }

    $scope.openSubreddit = function (e, url) {
      console.log('[rpSubredditsCtrl] openSubreddit, url: ' + url);
      $timeout(function () {
        rpAppLocationService(e, url, '', true, false);
      }, 350);
    };

    $scope.$on('$destroy', function () {
      deregisterSubredditsUpdated();
    });
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
