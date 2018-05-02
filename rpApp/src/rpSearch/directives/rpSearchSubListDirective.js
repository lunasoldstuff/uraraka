(function () {
  'use strict';

  function rpSearchSubList() {
    return {
      restrict: 'E',
      templateUrl: 'rpSearch/views/rpSearchSubList.html'
    };
  }

  angular.module('rpSearch')
    .directive('rpSearchSubList', [rpSearchSubList]);
}());
