(function () {
  'use strict';

  function rpPlus() {
    return {
      restrict: 'E',
      templateUrl: 'rpPlus/views/rpPlus.html',
      controller: 'rpPlusCtrl'
    };
  }


  angular.module('rpPlus')
    .directive('rpPlus', [rpPlus]);
}());
