(function () {
  'use strict';

  function rpSearchLink() {
    return {
      restrict: 'E',
      templateUrl: 'rpSearch/views/rpSearchLink.html'
    };
  }

  angular.module('rpSearch')
    .directive('rpSearchLink', [rpSearchLink]);
}());
