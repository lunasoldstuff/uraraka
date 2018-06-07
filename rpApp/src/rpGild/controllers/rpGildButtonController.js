(function () {
  'use strict';

  function rpGildButtonCtrl(
    $scope,
    rpGildService,
    rpAppAuthService,
    rpToastService,
    rpLoginService
  ) {
    console.log('[rpGildButtonCtrl]');

    $scope.gild = function () {
      if (rpAppAuthService.isAuthenticated) {
        rpGildService($scope.redditId, function (err, data) {
          if (err) {
            console.log('[rpGildButtonCtrl] err');
          } else {
            console.log('[rpGildButtonCtrl] success');
            $scope.gilded++;
          }
        });
      } else {
        rpLoginService.showDialog();
      }
    };
  }

  angular
    .module('rpGild')
    .controller('rpGildButtonCtrl', [
      '$scope',
      'rpGildService',
      'rpAppAuthService',
      'rpToastService',
      'rpLoginService',
      rpGildButtonCtrl
    ]);
}());
