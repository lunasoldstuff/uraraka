(function () {
  'use strict';


  function rpSlideshowProgressCtrl(
    $scope,
    $rootScope,
    $timeout,
    rpSettingsService
  ) {
    var deregisterStopProgress;
    var deregisterStartProgress;
    var cancelTickProgress;

    console.log('[rpSlideshowProgressCtrl]');

    $scope.showProgress = false;

    function stopProgress() {
      $scope.slideshowProgress = 0;
      $scope.showProgress = false;
      $timeout(angular.noop, 0);
      $timeout.cancel(cancelTickProgress);
    }

    function startProgress() {
      $scope.slideshowProgress = 100;
      $scope.showProgress = true;
      let startTime = new Date();
      console.log('[rpSlideshowProgressCtrl] startProgress(), startTime: ' + startTime.valueOf());

      function tickProgress() {
        let timeElapsed = new Date() - startTime;
        console.log('[rpSlideshowProgressCtrl] tickProgress(), timeElapsed: ' + timeElapsed.valueOf());

        if (timeElapsed > rpSettingsService.getSetting('slideshowTime')) {
          stopProgress();
        } else {
          $scope.slideshowProgress = ((rpSettingsService.getSetting('slideshowTime') - timeElapsed) /
            rpSettingsService.getSetting('slideshowTime')) * 100;
          console.log('[rpSlideshowProgressCtrl] tickProgress(), $scope.slideshowProgress: ' + $scope.slideshowProgress);
          $timeout(angular.noop, 0);
          cancelTickProgress = $timeout(tickProgress, 500);
        }
      }

      tickProgress();
    }

    deregisterStartProgress = $rootScope.$on('rp_slideshow_progress_start', function () {
      console.log('[rpSlideshowProgressCtrl] rp_slideshow_progress_start');
      startProgress();
    });

    deregisterStopProgress = $rootScope.$on('rp_slideshow_progress_stop', function () {
      console.log('[rpSlideshowProgressCtrl] rp_slideshow_progress_stop');
      stopProgress();
    });

    $scope.$on('$destroy', function () {
      deregisterStartProgress();
      deregisterStopProgress();
    });
  }

  angular.module('rpSlideshow')
    .controller('rpSlideshowProgressCtrl', [
      '$scope',
      '$rootScope',
      '$timeout',
      'rpSettingsService',
      rpSlideshowProgressCtrl
    ]);
}());
