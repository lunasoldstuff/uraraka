(function () {
  'use strict';

  function rpMediaDefault() {
    return {
      restrict: 'E',
      templateUrl: 'rpMedia/rpMediaDefault/views/rpMediaDefault.html',
      controller: 'rpMediaDefaultCtrl'
    };
  }

  angular.module('rpMediaDefault')
    .directive('rpMediaDefault', [rpMediaDefault]);
}());
