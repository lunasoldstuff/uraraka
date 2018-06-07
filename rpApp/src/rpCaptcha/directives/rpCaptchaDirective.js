(function () {
  'use strict';

  function rpCaptcha() {
    return {
      restrict: 'E',
      templateUrl: 'rpCaptcha/views/rpCaptcha.html',
      controller: 'rpCaptchaCtrl'
    };
  }

  angular.module('rpCaptcha')
    .directive('rpCaptcha', rpCaptcha);
}());
