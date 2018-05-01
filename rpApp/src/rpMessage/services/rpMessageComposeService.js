(function () {
  'use strict';

  function rpMessageComposeService(rpAppAuthService, rpAppRedditApiService, rpToastService) {
    return function (subject, text, to, iden, captcha, callback) {
      if (rpAppAuthService.isAuthenticated) {
        rpAppRedditApiService.redditRequest('post', '/api/compose', {
          subject: subject,
          text: text,
          to: to,
          iden: iden,
          captcha: captcha
        }, function (data) {
          if (data.responseError) {
            rpToastService('something went wrong trying to send your message', 'sentiment_dissatisfied');
            callback(data, null);
          } else {
            console.log('[rpMessageComposeService] data: ' + JSON.stringify(data));
            callback(null, data);
          }
        });
      } else {
        rpToastService('you must log in send messages', 'sentiment_neutral');
      }
    };
  }

  angular.module('rpMessage')
    .factory('rpMessageComposeService', [
      'rpAppAuthService',
      'rpAppRedditApiService',
      'rpToastService',
      rpMessageComposeService
    ]);
}());
