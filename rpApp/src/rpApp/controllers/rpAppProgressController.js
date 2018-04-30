(function () {
  'use strict';

  function rpAppProgressCtrl($scope, $rootScope, $log, $timeout) {
    var deregisterProgressStop;
    var deregisterProgressStart;
    $scope.loading = false;

    deregisterProgressStart = $rootScope.$on('rp_progress_start', function (e, d) {
      console.log('[rpAppProgressCtrl] rp_progress_start');
      $scope.loading = true;
      $timeout(angular.noop, 0);
    });

    deregisterProgressStop = $rootScope.$on('rp_progress_stop', function (e, d) {
      console.log('[rpAppProgressCtrl] rp_progress_stop');
      $scope.loading = false;
      $timeout(angular.noop, 0);
    });

    $scope.$on('$destroy', function () {
      deregisterProgressStart();
      deregisterProgressStop();
    });
  }

  angular.module('rpApp')
    .controller('rpAppProgressCtrl', [
      '$scope',
      '$rootScope',
      '$log',
      '$timeout',
      rpAppProgressCtrl
    ]);
}());
