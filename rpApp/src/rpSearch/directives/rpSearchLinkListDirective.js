(function () {
  'use strict';

  function rpSearchLinkList() {
    return {
      restrict: 'E',
      templateUrl: 'rpSearch/views/rpSearchLinkList.html'
    };
  }

  angular.module('rpSearch')
    .directive('rpSearchLinkList', [rpSearchLinkList]);
}());
