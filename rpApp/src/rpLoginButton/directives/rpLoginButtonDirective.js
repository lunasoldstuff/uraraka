(function () {
  'use strict';

  function rpLoginButton() {
    return {
      restrict: 'E',
      templateUrl: 'rpLoginButton/views/rpLoginButton.html',
      controller: 'rpLoginButtonCtrl',
      scope: {
        path: '@path'
      }
    };
  }

  angular.module('rpLoginButton')
    .directive('rpLoginButton', [rpLoginButton]);
}());
