(function () {
  'use strict';

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
      rpAppTitleChangeService.changeTitles('submit to reddit');
    }

    if (!$scope.isDialog && $routeParams.sub) {
      $scope.subreddit = $routeParams.sub;
    }

    console.log('[rpSubmitCtrl] $scope.subreddit: ' + $scope.subreddit);
  }

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
}());
