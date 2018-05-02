(function () {
  'use strict';

  function rpSearchSubscriptionCtrl($scope, $rootScope, $timeout, rpSubredditsService) {
    var deregisterSubredditsUpdated;
    console.log('[rpSearchSubscriptionCtrl] loaded.');
    $scope.loadingSubscription = false;
    // $scope.subscribed = false;
    $scope.subscribed = rpSubredditsService.isSubscribed($scope.post.data.display_name);

    $scope.toggleSubscription = function () {
      $scope.loadingSubscription = true;
      // $timeout(angular.noop, 0);
      let action = $scope.subscribed ? 'unsub' : 'sub';

      console.log('[rpSearchSubscriptionCtrl] toggleSubscription(), $scope.post.data.title: ' + $scope.post.data.display_name +
        ', subscribed: ' + $scope.subscribed);

      rpSubredditsService.subscribe(action, $scope.post.data.name, function (err, data) {
        console.log('[rpSearchSubscriptionCtrl] callback, $scope.post.data.title: ' + $scope.post.data.title);
        if (err) {
          console.log('[rpSearchSubscriptionCtrl] err');
        } else {
          console.log('[rpSearchSubscriptionCtrl] callback, subscribed: ' + $scope.subscribed);
          $scope.loadingSubscription = false;
          console.log('[rpSearchSubscriptionCtrl] callback, subscribed: ' + $scope.subscribed);
        }
      });
    };

    deregisterSubredditsUpdated = $rootScope.$on('subreddits_updated', function () {
      $scope.subscribed = rpSubredditsService.isSubscribed($scope.post.data.display_name);
    });

    $scope.$on('$destroy', function () {
      deregisterSubredditsUpdated();
    });
  }

  angular.module('rpSearch')
    .controller('rpSearchSubscriptionCtrl', [
      '$scope',
      '$rootScope',
      '$timeout',
      'rpSubredditsService',
      rpSearchSubscriptionCtrl
    ]);
}());
