(function () {
  'use strict';

  function rpSaveButtonCtrl(
    $scope,
    rpSaveService,
    rpAppAuthService,
    rpToastService,
    rpLoginService
  ) {
    $scope.save = function () {
      if (rpAppAuthService.isAuthenticated) {
        $scope.saved = !$scope.saved;

        rpSaveService($scope.redditId, $scope.saved, function (err, data) {
          if (err) {
            console.log('[rpSaveButtonCtrl] err');
          } else {
            console.log('[rpSaveButtonCtrl] success');
          }
        });
      } else {
        rpLoginService.showDialog();
      }
    };
  }

  angular
    .module('rpSave')
    .controller('rpSaveButtonCtrl', [
      '$scope',
      'rpSaveService',
      'rpAppAuthService',
      'rpToastService',
      'rpLoginService',
      rpSaveButtonCtrl
    ]);
}());
