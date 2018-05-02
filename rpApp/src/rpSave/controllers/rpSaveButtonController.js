(function () {
  'use strict';

  function rpSaveButtonCtrl(
    $scope,
    rpSaveService,
    rpAppAuthService,
    rpToastService

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
        rpToastService('you must log in to save posts', 'sentiment_neutral');
      }
    };
  }

  angular.module('rpSave')
    .controller('rpSaveButtonCtrl', [
      '$scope',
      'rpSaveService',
      'rpAppAuthService',
      'rpToastService',
      rpSaveButtonCtrl
    ]);
}());
