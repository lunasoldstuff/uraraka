(function () {
  'use strict';

  function rpSidenavButtonCtrl($scope, $rootScope, $mdSidenav) {
    var deregisterRouteChangeSuccess = $scope.$on(
      '$routeChangeSuccess',
      function () {
        if ($mdSidenav('left').isOpen()) {
          $mdSidenav('left').toggle();
        }
      }
    );

    this.toggleSidenav = function () {
      $mdSidenav('left').toggle();
    };

    console.log('[rpSidenavButtonCtrl]');

    $scope.$on('$destroy', () => {
      deregisterRouteChangeSuccess();
    });
  }

  angular
    .module('rpSidenav')
    .controller('rpSidenavButtonCtrl', [
      '$scope',
      '$rootScope',
      '$mdSidenav',
      rpSidenavButtonCtrl
    ]);
}());
