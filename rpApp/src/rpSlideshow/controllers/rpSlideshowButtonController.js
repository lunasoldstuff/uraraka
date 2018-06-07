(function () {
  'use strict';

  function rpSlideshowButtonCtrl($scope, $rootScope, rpSlideshowService) {
    console.log('[rpSlideshowButtonCtrl] load');
    $scope.startSlideshow = function () {
      console.log('[rpSlideshowButtonCtrl] startSlideshow()');
      rpSlideshowService.startSlideshow();
    };
  }

  angular
    .module('rpSlideshow')
    .controller('rpSlideshowButtonCtrl', [
      '$scope',
      '$rootScope',
      'rpSlideshowService',
      rpSlideshowButtonCtrl
    ]);
}());
