(function () {
  'use strict';

  function rpSearchSubscriptionCtrl(
    $scope,
    $rootScope,
    $timeout,
    rpSubredditsService
  ) {
    console.log('[rpSearchSubscriptionCtrl] loaded.');
    $scope.loadingSubscription = false;
    $scope.subscribed = $scope.post.data.user_is_subscriber;

    $scope.toggleSubscription = function () {
      $scope.loadingSubscription = true;
      $timeout(angular.noop, 0);
      let action = $scope.subscribed ? 'unsub' : 'sub';

      console.log('[rpSearchSubscriptionCtrl] toggleSubscription(), $scope.post.data.title: ' + $scope.post.data.display_name +
        ', subscribed: ' + $scope.subscribed);

      rpSubredditsService.subscribe(action, $scope.post.data.name, function (err, data) {
        console.log('[rpSearchSubscriptionCtrl] callback, $scope.post.data.title: ' + $scope.post.data.title);
        if (err) {
          console.log('[rpSearchSubscriptionCtrl] err');
        } else {
          $scope.loadingSubscription = false;
          $scope.subscribed = !$scope.subscribed;
          $timeout(angular.noop, 0);
        }
      });
    };

    $scope.$on('$destroy', function () {});
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
