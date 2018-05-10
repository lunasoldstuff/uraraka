(function () {
  'use strict';

  function rpSidebarButtonCtrl(
    $scope,
    $rootScope,
    $mdSidenav
  ) {
    var deregisterRouteChangeSuccess = $scope.$on('$routeChangeSuccess', function () {
      if ($mdSidenav('right')
        .isOpen()) {
        $mdSidenav('right')
          .toggle();
      }
    });

    this.toggleSidebar = function () {
      $mdSidenav('right')
        .toggle();
    };

    console.log('[rpSidebarButtonCtrl]');

    $scope.$on('$destroy', () => {
      deregisterRouteChangeSuccess();
    });
  }

  angular.module('rpSidebar')
    .controller('rpSidebarButtonCtrl', [
      '$scope',
      '$rootScope',
      '$mdSidenav',
      rpSidebarButtonCtrl
    ]);
}());
