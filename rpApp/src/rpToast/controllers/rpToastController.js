(function () {
  'use strict';

  function rpToastCtrl($scope, $rootScope, $mdToast, toastMessage, toastIcon) {
    $scope.toastMessage = toastMessage;
    $scope.toastIcon = toastIcon;

    $scope.closeToast = function () {
      $mdToast.close();
    };
  }

  angular.module('rpToast')
    .controller('rpToastCtrl', [
      '$scope',
      '$rootScope',
      '$mdToast',
      'toastMessage',
      'toastIcon',
      rpToastCtrl
    ]);
}());
