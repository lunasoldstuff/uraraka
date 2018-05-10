(function () {
  'use strict';

  function rpSidenavButton() {
    return {
      restrict: 'E',
      templateUrl: 'rpSidenav/views/rpSidenavButton.html',
      controller: 'rpSidenavButtonCtrl',
      controllerAs: 'sidenavButtonCtrl'
    };
  }

  angular.module('rpSidenav')
    .directive('rpSidenavButton', [rpSidenavButton]);
}());
