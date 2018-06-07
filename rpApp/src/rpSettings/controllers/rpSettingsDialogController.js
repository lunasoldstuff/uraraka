(function () {
  'use strict';


  function rpSettingsDialogCtrl(
    $scope,
    $rootScope,
    $mdDialog,
    rpSettingsService
  ) {
    var deregisterLocationChangeSuccess;
    $scope.isDialog = true;

    // Close the dialog if user navigates to a new page.
    deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function () {
      $mdDialog.hide();
    });

    $scope.$on('$destroy', function () {
      deregisterLocationChangeSuccess();
    });
  }

  angular.module('rpSettings')
    .controller('rpSettingsDialogCtrl', [
      '$scope',
      '$rootScope',
      '$mdDialog',
      'rpSettingsService',
      rpSettingsDialogCtrl
    ]);
}());
