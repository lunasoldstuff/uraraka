(function () {
  'use strict';

  function rpSlideshowSettingsPanelCtrl(
    $scope,
    $rootScope,
    $timeout,
    rpSettingsService
  ) {
    console.log('[rpSlideshowSettingsCtrl]');

    // required or else view bindings don't get set correctly.
    $timeout(() => {
      $scope.settings = rpSettingsService.getSettings();
    }, 0);

    $scope.$on('$destroy', function () {
      $rootScope.$emit('rp_slideshow_show_header');
    });
  }

  angular.module('rpSlideshow')
    .controller('rpSlideshowSettingsPanelCtrl', [
      '$scope',
      '$rootScope',
      '$timeout',
      'rpSettingsService',
      rpSlideshowSettingsPanelCtrl
    ]);
}());
