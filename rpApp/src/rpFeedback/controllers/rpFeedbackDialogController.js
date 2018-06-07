(function () {
  'use strict';

  function rpFeedbackDialogCtrl($scope, rpSettingsService) {
    console.log('[rpFeedbackDialogCtrl] load');
    $scope.isDialog = true;
  }

  angular.module('rpFeedback')
    .controller('rpFeedbackDialogCtrl', [
      '$scope',
      'rpSettingsService',
      rpFeedbackDialogCtrl
    ]);
}());
