(function () {
  'use strict';

  function rpNightThemeButtonCtrl($scope, $rootScope, rpSettingsService) {
    $scope.toggleNightTheme = function () {
      rpSettingsService.setSetting('nightTheme', !rpSettingsService.getSetting('nightTheme'));
    };

    $scope.$on('$destroy', function () {});
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
