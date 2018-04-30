(function () {
  'use strict';

  function rpCaptchaNewResourceService($resource) {
    return $resource('/api/uauth/new_captcha');
  }

  angular.module('rpCaptcha')
    .factory('rpCaptchaNewResourceService', [
      '$resource',
      rpCaptchaNewResourceService
    ]);
}());
