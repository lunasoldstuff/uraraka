(function () {
  'use strict';

  function rpShareEmailDialogCtrl(
    $scope,
    $location,
    $mdDialog,
    shareLink,
    shareTitle,
    rpSettingsService

  ) {
    var deregisterLocationChangeSuccess;
    $scope.animations = rpSettingsService.settings.animations;

    console.log('[rpShareEmailDialogCtrl] shareLink: ' + shareLink);
    console.log('[rpShareEmailDialogCtrl] shareTitle: ' + shareTitle);

    $scope.shareLink = shareLink || null;
    $scope.shareTitle = shareTitle || null;

    $scope.dialog = true;

    deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function () {
      $mdDialog.hide();
    });

    $scope.$on('$destroy', function () {
      deregisterLocationChangeSuccess();
    });
  }


  angular.module('rpShare')
    .controller('rpShareEmailDialogCtrl', [
      '$scope',
      '$location',
      '$mdDialog',
      'shareLink',
      'shareTitle',
      'rpSettingsService',
      rpShareEmailDialogCtrl
    ]);
}());
