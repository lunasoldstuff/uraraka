(function () {
  'use strict';

  function rpMessageComposeService(
    rpAppAuthService,
    rpRedditRequestService,
    rpToastService,
    rpLoginService
  ) {
    return function (subject, text, to, iden, captcha, callback) {
      if (rpAppAuthService.isAuthenticated) {
        rpRedditRequestService.redditRequest(
          'post',
          '/api/compose',
          {
            subject: subject,
            text: text,
            to: to,
            iden: iden,
            captcha: captcha
          },
          function (data) {
            if (data.responseError) {
              rpToastService(
                'something went wrong trying to send your message',
                'sentiment_dissatisfied'
              );
              callback(data, null);
            } else {
              console.log('[rpMessageComposeService] data: ' + JSON.stringify(data));
              callback(null, data);
            }
          }
        );
      } else {
        rpLoginService.showDialog();
      }
    };
  }

  angular
    .module('rpMessage')
    .factory('rpMessageComposeService', [
      'rpAppAuthService',
      'rpRedditRequestService',
      'rpToastService',
      'rpLoginService',
      rpMessageComposeService
    ]);
}());
