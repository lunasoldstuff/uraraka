(function () {
  'use strict';

  function rpLoginButton() {
    return {
      restrict: 'E',
      templateUrl: 'rpLogin/views/rpLoginButton.html',
      controller: 'rpLoginButtonCtrl',
      scope: {
        path: '@path'
      }
    };
  }

  angular.module('rpLogin').directive('rpLoginButton', [rpLoginButton]);
}());
