(function () {
  'use strict';

  function rpMessageComposeDialogCtrl(
    $scope,
    $location,
    $mdDialog,
    rpSettingsService,
    shareLink,
    shareTitle
  ) {
    var deregisterLocationChangeSuccess;

    $scope.animations = rpSettingsService.settings.animations;
    $scope.shareLink = shareLink || null;
    $scope.shareTitle = shareTitle || null;
    $scope.dialog = true;

    // Close the dialog if user navigates to a new page.
    deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function () {
      $mdDialog.hide();
    });

    $scope.$on('$destroy', function () {
      deregisterLocationChangeSuccess();
    });
  }

  angular.module('rpMessageCompose')
    .controller('rpMessageComposeDialogCtrl', [
      '$scope',
      '$location',
      '$mdDialog',
      'rpSettingsService',
      'shareLink',
      'shareTitle',
      rpMessageComposeDialogCtrl
    ]);
}());
