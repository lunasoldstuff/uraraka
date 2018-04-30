(function () {
  'use strict';

  function rpCaptchaNeedsResourceService($resource) {
    return $resource('/api/uauth/needs_captcha');
  }

  angular.module('rpCaptcha')
    .factory('rpCaptchaNeedsResourceService', [
      '$resource',
      rpCaptchaNeedsResourceService
    ]);
}());
