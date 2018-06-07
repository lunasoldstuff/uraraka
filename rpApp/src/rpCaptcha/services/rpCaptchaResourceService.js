(function () {
  'use strict';

  function rpCaptchaResourceService($resource) {
    return $resource('/api/uauth/captcha/:iden');
  }

  angular.module('rpCaptcha')
    .factory('rpCaptchaResourceService', [
      '$resource',
      rpCaptchaResourceService
    ]);
}());
