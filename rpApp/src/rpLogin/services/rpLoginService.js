(function () {
  'use strict';

  function rpLoginService($mdDialog) {
    var loginService = {
      showDialog() {
        $mdDialog.show({
          templateUrl: 'rpLogin/views/rpLoginDialog.html',
          clickOutsideToClose: true,
          escapeToClose: true
        });
      }
    };

    return loginService;
  }

  angular
    .module('rpLogin')
    .factory('rpLoginService', ['$mdDialog', rpLoginService]);
}());
