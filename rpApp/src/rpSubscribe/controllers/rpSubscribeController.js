(function () {
  'use strict';

  function rpSubscribeCtrl(
    $scope,
    $rootScope,
    $timeout,
    rpSubredditsService,
    rpToolbarButtonVisibilityService,
    rpAppAuthService
  ) {
    var deregisterSubscriptionStatusChanged;

    console.log('[rpSubscribeCtrl] loaded');
    console.log('[rpSubscribeCtrl] loaded, $scope.appCtrl.isAuthenticated: ' + $scope.appCtrl.isAuthenticated);

    $scope.visibilitySettings = rpToolbarButtonVisibilityService.visibilitySettings;
    $scope.subredditsService = rpSubredditsService;
    $scope.loadingSubscription = false;

    $scope.toggleSubscription = function () {
      console.log('[rpSubscribeCtrl] toggleSubscription');
      $scope.loadingSubscription = true;
      $timeout(angular.noop, 0);

      rpSubredditsService.subscribeCurrent(function (err, data) {
        if (err) {
          console.log('[rpSubscribeCtrl] err');
        }
        console.log('[rpSubscribeCtrl()] subscribeCurrent callback');
        $scope.loadingSubscription = false;
        $timeout(angular.noop, 0);
      });
    };

    $scope.$on('$destroy', function () {
      deregisterSubscriptionStatusChanged();
    });
  }

  angular
    .module('rpSubscribe')
    .controller('rpSubscribeCtrl', [
      '$scope',
      '$rootScope',
      '$timeout',
      'rpSubredditsService',
      'rpToolbarButtonVisibilityService',
      'rpAppAuthService',
      rpSubscribeCtrl
    ]);
}());
