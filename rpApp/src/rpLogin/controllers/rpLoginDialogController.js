(function () {
  'use strict';

  function rpLoginDialogCtrl($scope, rpLoginService) {
    $scope.closeDialog = function () {
      rpLoginService.closeDialog();
    };
  }

  angular
    .module('rpLogin')
    .controller('rpLoginDialogCtrl', [
      '$scope',
      'rpLoginService',
      rpLoginDialogCtrl
    ]);
}());
