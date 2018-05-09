(function () {
  'use strict';

  function rpSidebar() {
    return {
      restrict: 'E',
      templateUrl: 'rpSidebar/views/rpSidebar.html',
      controller: 'rpSidebarCtrl',
      controllerAs: 'sidebarCtrl'
    };
  }

  angular.module('rpSidebar')
    .directive('rpSidebar', [rpSidebar]);
}());
