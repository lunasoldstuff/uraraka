(function () {
  'use strict';

  function rpSidebarButtonCtrl(
    $scope,
    $mdSidenav
  ) {
    console.log('[rpSidebarButtonCtrl]');
    this.toggleSidebar = function () {
      $mdSidenav('right')
        .toggle();
    };
  }

  angular.module('rpSidebar')
    .controller('rpSidebarButtonCtrl', [
      '$scope',
      '$mdSidenav',
      rpSidebarButtonCtrl
    ]);
}());
