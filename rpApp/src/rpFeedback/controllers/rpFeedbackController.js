(function () {
  'use strict';

  function rpFeedbackCtrl(
    $scope,
    $rootScope,
    rpAppTitleChangeService,
    rpToolbarButtonVisibilityService
  ) {
    console.log('[rpFeedbackCtrl] load');

    if (!$scope.isDialog) {
      rpToolbarButtonVisibilityService.hideAll();
      rpAppTitleChangeService('send feedback', true, true);
    }

    $scope.isFeedback = true;

    $scope.formatting = false;
    $scope.toggleFormatting = function () {
      $scope.formatting = !$scope.formatting;
    };
  }

  angular
    .module('rpFeedback')
    .controller('rpFeedbackCtrl', [
      '$scope',
      '$rootScope',
      'rpAppTitleChangeService',
      'rpToolbarButtonVisibilityService',
      rpFeedbackCtrl
    ]);
}());
