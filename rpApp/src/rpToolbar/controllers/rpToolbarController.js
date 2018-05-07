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
    rpToolbarButtonVisibilityService
  ) {
    var subredditRe = /r\/[\w]+/;
    var userRe = /u\/[\w]+/;

    var deregisterHandleTitleChange = $rootScope.$on('rp_title_change_toolbar', function (e, title) {
      console.log('[rpToolbarCtrl] handleTitleChange(), title: ' + title);

      $scope.toolbarTitle = title;
      $scope.linkTitle = subredditRe.test(title) || userRe.test(title);

      console.log('[rpToolbarCtrl] handleTitleChange(), $scope.linkTitle: ' + $scope.linkTitle);
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
      deregisterHandleTitleChange();
      deregisterRefreshButtonSpin();
      deregisterPlusSubscriptionUpdate();
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
      rpToolbarCtrl
    ]);
}());
