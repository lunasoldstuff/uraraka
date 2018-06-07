(function () {
  'use strict';

  function rpCaptchaService(
    rpAppAuthService,
    rpToastService,
    rpRedditRequestService
  ) {
    var captchaService = {
      needsCaptcha(callback) {
        rpRedditRequestService.redditRequest(
          'get',
          '/api/needs_captcha',
          {},
          function (data) {
            console.log('[rpCaptchaService] needsCaptcha, data: ' + JSON.stringify(data));
            if (data.responseError) {
              callback(data, null);
            } else {
              callback(null, data);
            }
          }
        );
      },
      newCaptcha(callback) {
        rpRedditRequestService.redditRequest(
          'post',
          '/api/new_captcha',
          {},
          function (data) {
            console.log('[rpCaptchaService] newCaptcha, data: ' + JSON.stringify(data));
            if (data.responseError) {
              callback(data, null);
            } else {
              callback(null, data);
            }
          }
        );
      }
    };

    return captchaService;
  }

  angular
    .module('rpCaptcha')
    .factory('rpCaptchaService', [
      'rpAppAuthService',
      'rpToastService',
      'rpRedditRequestService',
      rpCaptchaService
    ]);
}());
