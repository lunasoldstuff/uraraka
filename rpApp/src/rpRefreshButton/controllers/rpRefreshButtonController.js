(function () {
  'use strict';

  function rpRefreshButtonCtrl($scope, $rootScope) {
    console.log('[rpRefreshButtonCtrl] load');
    $scope.refresh = function () {
      console.log('[rpRefreshButtonCtrl] refresh()');
      $rootScope.$emit('rp_refresh');
    };
  }

  angular.module('rpRefreshButton')
    .controller('rpRefreshButtonCtrl', [
      '$scope',
      '$rootScope',
      rpRefreshButtonCtrl
    ]);
}());
