(function () {
  'use strict';

  function rpMediaRedditVideo($window, $sce, $timeout) {
    return {
      restrict: 'E',
      templateUrl: 'rpMedia/rpMediaRedditVideo/views/rpMediaRedditVideo.html',
      controller: 'rpMediaRedditVideoCtrl'

    };
  }

  angular.module('rpMediaRedditVideo')
    .directive('rpMediaRedditVideo', ['$window', '$sce', '$timeout', rpMediaRedditVideo]);
}());
