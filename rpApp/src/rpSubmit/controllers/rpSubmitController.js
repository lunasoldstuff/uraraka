(function () {
  'use strict';

  angular
    .module('rpSubmit')
    .controller('rpSubmitCtrl', [
      '$scope',
      '$rootScope',
      '$routeParams',
      'rpAppTitleChangeService',
      'rpToolbarButtonVisibilityService',
      rpSubmitCtrl
    ]);

  function rpSubmitCtrl(
    $scope,
    $rootScope,
    $routeParams,
    rpAppTitleChangeService,
    rpToolbarButtonVisibilityService
  ) {
    console.log('[rpSubmitCtrl] $scope.isDialog: ' + $scope.isDialog);

    $scope.formatting = false;

    $scope.toggleFormatting = function () {
      $scope.formatting = !$scope.formatting;
    };

    if (!$scope.isDialog) {
      rpToolbarButtonVisibilityService.hideAll();
      $rootScope.$emit('rp_tabs_hide');
      rpAppTitleChangeService('submit to reddit', true, true);
    }

    if (!$scope.isDialog && $routeParams.sub) {
      $scope.subreddit = $routeParams.sub;
    }

    console.log('[rpSubmitCtrl] $scope.subreddit: ' + $scope.subreddit);
  }
}());
