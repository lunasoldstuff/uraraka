(function () {
  'use strict';

  function rpProgressCtrl(
    $scope,
    $timeout,
    rpProgressService
  ) {
    let progressCtrl = this;
    // progressCtrl.loading = false;
    progressCtrl.progress = rpProgressService;
  }

  angular.module('rpApp')
    .controller('rpProgressCtrl', [
      '$scope',
      '$timeout',
      'rpProgressService',
      rpProgressCtrl
    ]);
}());
