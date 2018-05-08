(function () {
  'use strict';

  function rpSettingsSidenavCtrl(
    $scope,
    $rootScope,
    $mdDialog,
    $mdPanel,
    rpSettingsService,
    rpAppLocationService,
    rpAppIsMobileViewService

  ) {
    console.log('[rpSettingsSidenavCtrl]');
    $scope.showSettings = function (e) {
      console.log('[rpSettingsSidenavCtrl] $scope.$parent.animations: ' + $scope.$parent.animations);
      console.log('[rpSettingsSidenavCtrl] $scope.animations: ' + $scope.animations);

      if ((rpSettingsService.getSetting('settingsDialog') && !e.ctrlKey) || rpAppIsMobileViewService.isMobileView()) {
        $mdDialog.show({
          controller: 'rpSettingsDialogCtrl',
          templateUrl: 'rpSettings/views/rpSettingsDialog.html',
          clickOutsideToClose: true,
          escapeToClose: true

        });
      } else {
        rpAppLocationService(e, '/settings', '', true, false);
      }
    };

    $scope.$on('$destroy', function () {

    });
  }

  angular.module('rpSettings')
    .controller('rpSettingsSidenavCtrl', [
      '$scope',
      '$rootScope',
      '$mdDialog',
      '$mdPanel',
      'rpSettingsService',
      'rpAppLocationService',
      'rpAppIsMobileViewService',
      rpSettingsSidenavCtrl
    ]);
}());
