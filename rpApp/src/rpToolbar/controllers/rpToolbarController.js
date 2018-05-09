(function () {
  'use strict';

  function rpToolbarCtrl(
    $scope,
    $rootScope,
    $log,
    $element,
    $timeout,
    rpAppLocationService,
    rpPlusSubscriptionService,
    rpToolbarButtonVisibilityService,
    rpAppTitleChangeService
  ) {
    var subredditRe = /r\/[\w]+/;
    var userRe = /u\/[\w]+/;

    var deregisterTitleWatcher = $scope.$watch(() => {
      return $scope.appCtrl.titles.toolbar;
    }, (newVal) => {
      $scope.linkTitle = subredditRe.test(newVal) || userRe.test(newVal);
    });

    var deregisterPlusSubscriptionUpdate = $rootScope.$on('rp_plus_subscription_update', function (
      e,
      isSubscribed
    ) {
      $scope.isSubscribed = isSubscribed;
    });

    var deregisterRefreshButtonSpin = $rootScope.$on('rp_refresh_button_spin', function (e, spin) {
      $scope.spinRefresh = spin;
    });

    $scope.linkTitle = false;
    $scope.showToolbar = false;
    $scope.count = 0;

    $timeout(function () {
      $scope.showToolbar = true;
    }, 0);

    $scope.brandLink = function (e) {
      // console.log('[rpToolbarCtrl] brandLink(), e.data("events"): ' + e.data("events"));
      rpAppLocationService(e, '/', '', true, true);
    };

    $scope.buttonVisibility = rpToolbarButtonVisibilityService.visibilitySettings;

    rpPlusSubscriptionService.isSubscribed(function (isSubscribed) {
      $scope.isSubscribed = isSubscribed;
    });

    $scope.$on('$destroy', function () {
      deregisterRefreshButtonSpin();
      deregisterPlusSubscriptionUpdate();
      deregisterTitleWatcher();
    });
  }
  angular
    .module('rpToolbar')
    .controller('rpToolbarCtrl', [
      '$scope',
      '$rootScope',
      '$log',
      '$element',
      '$timeout',
      'rpAppLocationService',
      'rpPlusSubscriptionService',
      'rpToolbarButtonVisibilityService',
      'rpAppTitleChangeService',
      rpToolbarCtrl
    ]);
}());
