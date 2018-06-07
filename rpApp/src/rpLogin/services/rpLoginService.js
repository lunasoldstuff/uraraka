(function () {
  'use strict';

  function rpLoginService($mdDialog) {
    var loginService = {
      showDialog() {
        $mdDialog.show({
          templateUrl: 'rpLogin/views/rpLoginDialog.html',
          controller: 'rpLoginDialogCtrl',
          clickOutsideToClose: false,
          escapeToClose: true
        });
      },
      closeDialog() {
        $mdDialog.hide();
      }
    };

    return loginService;
  }

  angular
    .module('rpLogin')
    .factory('rpLoginService', ['$mdDialog', rpLoginService]);
}());
