(function () {
  'use strict';

  function rpSearchSub() {
    return {
      restrict: 'E',
      templateUrl: 'rpSearch/views/rpSearchSub.html'
    };
  }

  angular.module('rpSearch')
    .directive('rpSearchSub', [rpSearchSub]);
}());
