(function () {
  'use strict';

  function rpMediaGiphy() {
    return {
      restrict: 'E',
      templateUrl: 'rpMedia/rpMediaGiphy/views/rpMediaGiphy.html',
      controller: 'rpMediaGiphyCtrl'
    };
  }

  angular.module('rpMediaGiphy')
    .directive('rpMediaGiphy', [rpMediaGiphy]);
}());
