(function () {
  'use strict';

  function rpMediaYoutube() {
    return {
      restrict: 'E',
      templateUrl: 'rpMedia/rpMediaYoutube/views/rpMediaYoutube.html',
      controller: 'rpMediaYoutubeCtrl'
    };
  }


  angular.module('rpMediaYoutube')
    .directive('rpMediaYoutube', [rpMediaYoutube]);
}());
