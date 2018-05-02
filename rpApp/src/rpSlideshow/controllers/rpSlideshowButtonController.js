(function () {
  'use strict';

  function rpSlideshowButtonCtrl($scope, $rootScope) {
    console.log('[rpSlideshowButtonCtrl] load');
    $scope.startSlideshow = function () {
      console.log('[rpSlideshowButtonCtrl] startSlideshow()');
      $rootScope.$emit('rp_slideshow_start');
    };
  }

  angular.module('rpSlideshow')
    .controller('rpSlideshowButtonCtrl', [
      '$scope',
      '$rootScope',
      rpSlideshowButtonCtrl
    ]);
}());
