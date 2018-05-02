(function () {
  'use strict';

  function rpSlideshowSettingsPanelCtrl(
    $scope,
    $rootScope,
    $timeout,
    rpSettingsService
  ) {
    console.log('[rpSlideshowSettingsCtrl]');
    $scope.time = rpSettingsService.settings.slideshowTime / 1000;
    $scope.theme = rpSettingsService.settings.theme;

    $timeout(function () {
      $scope.slideshowHeader = rpSettingsService.settings.slideshowHeader;
      $scope.slideshowHeaderFixed = rpSettingsService.settings.slideshowHeaderFixed;
      $scope.slideshowAutoplay = rpSettingsService.settings.slideshowAutoplay;
      console.log('[rpSlideshowSettingsCtrl] slideshowHeaderFixed: ' + $scope.slideshowHeaderFixed);
      console.log('[rpSlideshowSettingsCtrl] slideshowAutoplay: ' + $scope.slideshowAutoplay);
    }, 0);


    $scope.timeSettingChanged = function () {
      console.log('[rpSlideshowSettingsCtrl] timeSettingChanged()');
      rpSettingsService.setSetting('slideshowTime', $scope.time * 1000);
    };

    $scope.headerSettingChanged = function () {
      console.log('[rpSlideshowSettingsCtrl] headerSettingChanged()');
      rpSettingsService.setSetting('slideshowHeader', $scope.slideshowHeader);
    };

    $scope.headerFixedSettingChanged = function () {
      console.log('[rpSlideshowSettingsCtrl] headerFixedSettingChanged()');
      rpSettingsService.setSetting('slideshowHeaderFixed', $scope.slideshowHeaderFixed);
    };

    $scope.autoplaySettingChanged = function () {
      console.log('[rpSlideshowSettingsCtrl] autoplaySettingChanged() $scope.slideshowAutoplay: ' + $scope.slideshowAutoplay);
      rpSettingsService.setSetting('slideshowAutoplay', $scope.slideshowAutoplay);
    };

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
