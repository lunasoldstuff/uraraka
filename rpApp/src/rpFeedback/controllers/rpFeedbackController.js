(function () {
  'use strict';

  function rpFeedbackCtrl(
    $scope,
    $rootScope,
    rpAppTitleService,
    rpToolbarButtonVisibilityService
  ) {
    console.log('[rpFeedbackCtrl] load');

    if (!$scope.isDialog) {
      rpToolbarButtonVisibilityService.hideAll();
      rpAppTitleService.changeTitles('send feedback');
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
      'rpAppTitleService',
      'rpToolbarButtonVisibilityService',
      rpFeedbackCtrl
    ]);
}());
