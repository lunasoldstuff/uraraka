(function () {
  'use strict';

  function rpProgressCtrl($scope, $rootScope, $log, $timeout) {
    let progressCtrl = this;
    var deregisterProgressStop;
    var deregisterProgressStart;
    progressCtrl.loading = false;

    // TODO: remove these events
    deregisterProgressStart = $rootScope.$on('rp_progress_start', function (e, d) {
      console.log('[rpAppProgressCtrl] rp_progress_start');
      progressCtrl.loading = true;
      $timeout(angular.noop, 0);
    });

    deregisterProgressStop = $rootScope.$on('rp_progress_stop', function (e, d) {
      console.log('[rpAppProgressCtrl] rp_progress_stop');
      progressCtrl.loading = false;
      $timeout(angular.noop, 0);
    });

    $scope.$on('$destroy', function () {
      deregisterProgressStart();
      deregisterProgressStop();
    });
  }

  angular.module('rpApp')
    .controller('rpProgressCtrl', [
      '$scope',
      '$rootScope',
      '$timeout',
      rpProgressCtrl
    ]);
}());
