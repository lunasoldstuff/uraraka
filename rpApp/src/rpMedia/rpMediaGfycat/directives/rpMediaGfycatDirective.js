(function () {
  'use strict';

  function rpMediaGfycat() {
    return {
      restrict: 'E',
      templateUrl: 'rpMedia/rpMediaGfycat/views/rpMediaGfycat.html',
      controller: 'rpMediaGfycatCtrl'
    };
  }

  angular.module('rpMediaGfycat')
    .directive('rpMediaGfycat', [rpMediaGfycat]);
}());
