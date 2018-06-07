(function () {
  'use strict';

  function rpToolbarCtrl(
    $scope,
    $rootScope,
    $log,
    $element,
    $timeout,
    rpAppLocationService,
    rpToolbarButtonVisibilityService,
    rpAppTitleService
  ) {
    var subredditRe = /r\/[\w]+/;
    var userRe = /u\/[\w]+/;

    var deregisterTitleWatcher = $scope.$watch(() => {
      return $scope.appCtrl.titles.toolbar;
    }, (newVal) => {
      $scope.linkTitle = subredditRe.test(newVal) || userRe.test(newVal);
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

    $scope.$on('$destroy', function () {
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
      'rpToolbarButtonVisibilityService',
      'rpAppTitleService',
      rpToolbarCtrl
    ]);
}());
