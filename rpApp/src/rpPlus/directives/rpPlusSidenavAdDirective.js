(function () {
  'use strict';

  function rpPlusSidenavAd() {
    return {
      restrict: 'E',
      templateUrl: 'rpPlus/views/rpPlusSidenavAd.html',
      controller: 'rpPlusSidenavCtrl'
    };
  }

  angular.module('rpPlus')
    .directive('rpPlusSidenavAd', [rpPlusSidenavAd]);
}());
