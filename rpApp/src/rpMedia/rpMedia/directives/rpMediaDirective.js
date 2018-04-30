(function () {
  'use strict';

  function rpMedia() {
    return {
      restrict: 'E',
      templateUrl: 'rpMedia/rpMedia/views/rpMedia.html',
      controller: 'rpMediaCtrl',
      scope: {
        url: '=',
        post: '=',
        slideshow: '=',
        nsfwOverride: '='
      }
    };
  }

  angular.module('rpMedia')
    .directive('rpMedia', [rpMedia]);
}());
