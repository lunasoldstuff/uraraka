(function () {
  'use strict';

  function rpSubmitService(rpAppAuthService, rpRedditRequestService, rpToastService) {
    return function (kind, resubmit, sendreplies, sr, text, title, url, iden, captcha, callback) {
      console.log('[rpSubmitService] iden: ' + iden);
      console.log('[rpSubmitService] captcha: ' + captcha);


      if (rpAppAuthService.isAuthenticated) {
        rpRedditRequestService.redditRequest('post', '/api/submit', {
          kind: kind,
          sendreplies: sendreplies,
          sr: sr,
          text: text,
          title: title,
          url: url,
          resubmit: resubmit,
          iden: iden,
          captcha: captcha
        }, function (data) {
          // Handle errors here instead of in controller.

          console.log('[rpSubmitService] data.constructor.name: ' + data.constructor.name);
          console.log('[rpSubmitService] data: ' + JSON.stringify(data));

          if (data.responseError) {
            callback(data, null);
          } else {
            console.log('[rpSubmitService] data: ' + JSON.stringify(data));
            callback(null, data);
          }
        });
      } else {
        rpToastService('you must log in to submit links', 'sentiment_neutral');
      }
    };
  }

  angular.module('rpSubmit')
    .factory('rpSubmitService', [
      'rpAppAuthService',
      'rpRedditRequestService',
      'rpToastService',
      rpSubmitService
    ]);
}());
