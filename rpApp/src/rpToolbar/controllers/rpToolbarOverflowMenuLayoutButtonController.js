(function () {
  'use strict';


  function rpToolbarOverflowMenuLayoutButtonCtrl(
    $scope,
    $rootScope,
    rpSettingsService
  ) {
    console.log('[rpToolbarOverflowMenuLayoutButtonCtrl] load');

    $scope.settings = rpSettingsService.getSettings();

    $scope.toggleLayout = function () {
      if (rpSettingsService.getSetting('layout') === 'listLayout') {
        rpSettingsService.setSetting('layout', 'singleColumnLayout');
      } else {
        rpSettingsService.setSetting('layout', 'listLayout');
      }
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
