(function () {
  'use strict';

  function rpLayoutButton() {
    return {
      restrict: 'E',
      templateUrl: 'rpLayoutButton/views/rpLayoutButton.html'
    };
  }

  angular.module('rpLayoutButton')
    .directive('rpLayoutButton', [rpLayoutButton]);
}());
