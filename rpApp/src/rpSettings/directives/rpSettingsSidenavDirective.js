(function () {
  'use strict';

  function rpSettingsSidenav() {
    return {
      restrict: 'E',
      templateUrl: 'rpSettings/views/rpSettingsSidenav.html',
      controller: 'rpSettingsSidenavCtrl'
    };
  }

  angular.module('rpSettings')
    .directive('rpSettingsSidenav', [rpSettingsSidenav]);
}());
