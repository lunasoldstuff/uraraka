(function () {
  'use strict';

  function rpFormatting() {
    return {
      restrict: 'E',
      templateUrl: 'rpFormatting/views/rpFormatting.html'
    };
  }

  angular.module('rpFormatting')
    .directive('rpFormatting', [rpFormatting]);
}());
