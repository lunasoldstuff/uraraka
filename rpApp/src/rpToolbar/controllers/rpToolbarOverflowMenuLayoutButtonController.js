(function () {
  'use strict';


  function rpToolbarOverflowMenuLayoutButtonCtrl(
    $scope,
    $rootScope,
    rpSettingsService
  ) {
    var deregisterSettingsChanged;
    console.log('[rpToolbarOverflowMenuLayoutButtonCtrl] load');

    $scope.layout = rpSettingsService.getSettings()
      .layout;
    console.log('[rpToolbarOverflowMenuLayoutButtonCtrl] $scope.layout: ' + $scope.layout);

    $scope.toggleLayout = function () {
      if ($scope.layout === 'listLayout') {
        rpSettingsService.setSetting('layout', 'singleColumnLayout');
      } else {
        $scope.layout = 'listLayout';
        rpSettingsService.setSetting('layout', 'listLayout');
      }
      $scope.layout = rpSettingsService.getSettings()
        .layout;
      console.log('[rpToolbarOverflowMenuLayoutButtonCtrl] toggleLayout(), $scope.layout: ' + $scope.layout);
    };

    deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function () {
      $scope.layout = rpSettingsService.getSettings()
        .layout;
    });

    $scope.$on('$destroy', function () {
      deregisterSettingsChanged();
    });
  }

  angular.module('rpToolbar')
    .controller('rpToolbarOverflowMenuLayoutButtonCtrl', [
      '$scope',
      '$rootScope',
      'rpSettingsService',
      rpToolbarOverflowMenuLayoutButtonCtrl
    ]);
}());
