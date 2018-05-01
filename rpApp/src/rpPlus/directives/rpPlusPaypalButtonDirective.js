(function () {
  'use strict';

  function rpPlusPaypalButton() {
    return {
      restrict: 'E',
      templateUrl: 'rpPlus/views/rpPlusPaypalButton.html'
    };
  }

  angular.module('rpPlus')
    .directive('rpPlusPaypalButton', [rpPlusPaypalButton]);
}());
