(function () {
  'use strict';

  function rpSearchSidenav() {
    return {
      restrict: 'E',
      templateUrl: 'rpSearch/views/rpSearchSidenav.html',
      controller: 'rpSearchSidenavCtrl'
    };
  }

  angular.module('rpSearch')
    .directive('rpSearchSidenav', [rpSearchSidenav]);
}());
