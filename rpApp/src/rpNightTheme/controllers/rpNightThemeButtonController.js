(function () {
  'use strict';

  function rpNightThemeButtonCtrl($scope, $rootScope, rpSettingsService) {
    var deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function () {
      $scope.isNightTheme = rpSettingsService.settings.nightTheme;
    });

    console.log('[rpNightThemeButtonCtrl] load');

    $scope.isNightTheme = rpSettingsService.settings.nightTheme;

    $scope.toggleNightTheme = function () {
      $scope.isNightTheme = !$scope.isNightTheme;
      rpSettingsService.setSetting('nightTheme', $scope.isNightTheme);
    };

    $scope.$on('$destroy', function () {
      deregisterSettingsChanged();
    });
  }

  angular
    .module('rpNightTheme')
    .controller('rpNightThemeButtonCtrl', [
      '$scope',
      '$rootScope',
      'rpSettingsService',
      rpNightThemeButtonCtrl
    ]);
}());
