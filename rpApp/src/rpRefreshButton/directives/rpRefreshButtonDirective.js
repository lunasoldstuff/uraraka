(function () {
  'use strict';

  function rpRefreshButton() {
    return {
      restrict: 'E',
      templateUrl: 'rpRefreshButton/views/rpRefreshButton.html',
      controller: 'rpRefreshButtonCtrl'
    };
  }

  angular.module('rpRefreshButton')
    .directive('rpRefreshButton', [rpRefreshButton]);
}());
