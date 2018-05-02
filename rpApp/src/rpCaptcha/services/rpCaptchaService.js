(function () {
  'use strict';

  function rpCaptchaService(rpAppAuthService, rpToastService, rpAppRedditApiService) {
    var captchaService = {
      needsCaptcha(callback) {
        rpAppRedditApiService.redditRequest('get', '/api/needs_captcha', {

        }, function (data) {
          console.log('[rpCaptchaService] needsCaptcha, data: ' + JSON.stringify(data));
          if (data.responseError) {
            callback(data, null);
          } else {
            callback(null, data);
          }
        });
      },
      newCaptcha(callback) {
        rpAppRedditApiService.redditRequest('post', '/api/new_captcha', {

        }, function (data) {
          console.log('[rpCaptchaService] newCaptcha, data: ' + JSON.stringify(data));
          if (data.responseError) {
            callback(data, null);
          } else {
            callback(null, data);
          }
        });
      }
    };

    return captchaService;
  }

  angular.module('rpCaptcha')
    .factory('rpCaptchaService', [
      'rpAppAuthService',
      'rpToastService',
      'rpAppRedditApiService',
      rpCaptchaService
    ]);
}());
