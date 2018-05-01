(function () {
  'use strict';

  function rpMessageSidenav() {
    return {
      restrict: 'E',
      templateUrl: 'rpMessage/rpMessage/views/rpMessageSidenav.html',
      controller: 'rpMessageSidenavCtrl'
    };
  }

  angular.module('rpMessage')
    .directive('rpMessageSidenav', [rpMessageSidenav]);
}());
