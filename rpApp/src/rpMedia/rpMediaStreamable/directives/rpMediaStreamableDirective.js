(function () {
  'use strict';

  function rpMediaStreamable() {
    return {
      restrict: 'E',
      templateUrl: 'rpMedia/rpMediaStreamable/views/rpMediaStreamable.html',
      controller: 'rpMediaStreamableCtrl'
    };
  }


  angular.module('rpMediaStreamable')
    .directive('rpMediaStreamable', [rpMediaStreamable]);
}());
