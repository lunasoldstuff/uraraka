(function () {
  'use strict';

  function rpSidenavButtonCtrl(
    $scope,
    $mdSidenav
  ) {
    console.log('[rpSidenavButtonCtrl]');
    this.toggleSidenav = function () {
      $mdSidenav('left')
        .toggle();
    };
  }

  angular.module('rpSidenav')
    .controller('rpSidenavButtonCtrl', [
      '$scope',
      '$mdSidenav',
      rpSidenavButtonCtrl
    ]);
}());
