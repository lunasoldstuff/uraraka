(function () {
  'use strict';


  function rpSettingsDialogCtrl(
    $scope,
    $rootScope,
    $mdDialog,
    rpSettingsService,
    animations,
    theme,
    tab

  ) {
    var deregisterSettingsChanged;
    var deregisterLocationChangeSuccess;
    console.log('[rpSettingsDialogCtrl] theme: ' + theme);
    $scope.theme = theme;
    $scope.animations = animations;
    $scope.selected = tab;
    // $scope.animations = rpSettingsService.settings.animations;

    $scope.isDialog = true;

    // Close the dialog if user navigates to a new page.
    deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function () {
      $mdDialog.hide();
    });

    deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function () {
      $scope.theme = rpSettingsService.settings.theme;
      console.log('[rpSettingsDialogCtrl] rp_settings_changed, $scope.theme: ' + $scope.theme);
    });

    $scope.$on('$destroy', function () {
      deregisterLocationChangeSuccess();
      deregisterSettingsChanged();
    });
  }

  angular.module('rpSettings')
    .controller('rpSettingsDialogCtrl', [
      '$scope',
      '$rootScope',
      '$mdDialog',
      'rpSettingsService',
      'animations',
      'theme',
      'tab',
      rpSettingsDialogCtrl
    ]);
}());
