(function () {
  'use strict';

  function rpOverflowMenu() {
    return {
      restrict: 'E',
      templateUrl: 'rpOverflowMenu/views/rpOverflowMenu.html'

    };
  }


  angular.module('rpOverflowMenu')
    .directive('rpOverflowMenu', [rpOverflowMenu]);
}());
