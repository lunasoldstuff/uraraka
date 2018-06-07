(function () {
  'use strict';

  function rpDeleteButtonMenu() {
    return {
      restrict: 'E',
      templateUrl: 'rpDelete/views/rpDeleteButtonMenu.html',
      controller: 'rpDeleteButtonCtrl',
      scope: {
        parentCtrl: '='

      }

    };
  }

  angular.module('rpDelete')
    .directive('rpDeleteButtonMenu', rpDeleteButtonMenu);
}());
