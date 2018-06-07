(function () {
  'use strict';

  function rpLoginDialogCtrl($scope, rpLoginService, rpSettingsService) {
    $scope.settings = rpSettingsService.settings;

    $scope.closeDialog = function () {
      rpLoginService.closeDialog();
    };
  }

  angular
    .module('rpLogin')
    .controller('rpLoginDialogCtrl', [
      '$scope',
      'rpLoginService',
      'rpSettingsService',
      rpLoginDialogCtrl
    ]);
}());
