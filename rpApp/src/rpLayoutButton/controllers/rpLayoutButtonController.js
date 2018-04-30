(function () {
  'use strict';

  function rpLayoutButtonCtrl($scope, $rootScope, rpSettingsService) {
    var deregisterSettingsChanged;
    console.log('[rpLayoutButtonCtrl] load');

    $scope.selection = {
      layout: rpSettingsService.getSettings()
        .layout
    };

    console.log('[rpLayoutButtonCtrl] $scope.selection.layout: ' + $scope.selection.layout);

    $scope.changeLayout = function () {
      console.log('[rpLayoutButtonCtrl] changeLayout(), $scope.selection.layout: ' + $scope.selection.layout);
      rpSettingsService.setSetting('layout', $scope.selection.layout);
    };

    deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function () {
      $scope.selection = {
        layout: rpSettingsService.getSettings()
          .layout
      };
    });

    $scope.$on('$destroy', function () {
      deregisterSettingsChanged();
    });
  }

  angular.module('rpLayoutButton')
    .controller('rpLayoutButtonCtrl', [
      '$scope',
      '$rootScope',
      'rpSettingsService',
      rpLayoutButtonCtrl
    ]);
}());
