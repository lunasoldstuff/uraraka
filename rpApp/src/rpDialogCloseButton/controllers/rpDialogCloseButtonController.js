(function () {
  'use strict';

  function rpDialogCloseButtonCtrl(
    $scope,
    $mdDialog,
    $mdBottomSheet
  ) {
    console.log('[rpDialogCloseButtonCtrl] load');
    $scope.closeDialog = function (e) {
      console.log('[rpDialogCloseButtonCtrl] closeDialog()');

      $mdDialog.hide();
      $mdBottomSheet.hide();
    };
  }

  angular.module('rpDialogCloseButton')
    .controller('rpDialogCloseButtonCtrl', [
      '$scope',
      '$mdDialog',
      '$mdBottomSheet',
      rpDialogCloseButtonCtrl
    ]);
}());
