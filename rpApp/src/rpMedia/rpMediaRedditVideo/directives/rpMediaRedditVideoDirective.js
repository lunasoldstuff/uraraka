(function () {
  'use strict';

  function rpMediaRedditVideo() {
    return {
      restrict: 'E',
      templateUrl: 'rpMedia/rpMediaRedditVideo/views/rpMediaRedditVideo.html',
      controller: 'rpMediaRedditVideoCtrl'
    };
  }

  angular.module('rpMediaRedditVideo')
    .directive('rpMediaRedditVideo', [rpMediaRedditVideo]);
}());
