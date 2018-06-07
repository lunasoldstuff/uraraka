(function () {
  'use strict';

  function rpSidebarButton() {
    return {
      restrict: 'E',
      templateUrl: 'rpSidebar/views/rpSidebarButton.html',
      controller: 'rpSidebarButtonCtrl',
      controllerAs: 'sidebarButtonCtrl'
    };
  }

  angular.module('rpSidebar')
    .directive('rpSidebarButton', [rpSidebarButton]);
}());
