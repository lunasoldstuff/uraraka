(function () {
  'use strict';


  function rpToolbarOverflowMenuLayoutButtonCtrl(
    $scope,
    $rootScope,
    rpSettingsService
  ) {
    console.log('[rpToolbarOverflowMenuLayoutButtonCtrl] load');

    $scope.settings = rpSettingsService.getSettings();
    console.log('[rpToolbarOverflowMenuLayoutButtonCtrl] $scope.settings.layout: ' + $scope.settings.layout);

    $scope.toggleLayout = function () {
      if (rpSettingsService.settings.layout === 'listLayout') {
        rpSettingsService.setSetting('layout', 'singleColumnLayout');
      } else {
        rpSettingsService.setSetting('layout', 'listLayout');
      }

      console.log('[rpToolbarOverflowMenuLayoutButtonCtrl] toggleLayout(), $scope.settings.layout: ' + $scope.settings
        .layout);
    };

    $scope.$on('$destroy', function () {});
  }

  angular.module('rpToolbar')
    .controller('rpToolbarOverflowMenuLayoutButtonCtrl', [
      '$scope',
      '$rootScope',
      'rpSettingsService',
      rpToolbarOverflowMenuLayoutButtonCtrl
    ]);
}());
