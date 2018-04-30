(function () {
  'use strict';

  function rpMediaImgur() {
    return {
      restrict: 'E',
      templateUrl: 'rpMedia/rpMediaImgur/views/rpMediaImgur.html',
      controller: 'rpMediaImgurCtrl'
    };
  }

  angular.module('rpMediaImgur')
    .directive('rpMediaImgur', [rpMediaImgur]);
}());
