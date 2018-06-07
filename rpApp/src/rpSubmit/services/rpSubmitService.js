(function () {
  'use strict';

  function rpSubmitService(
    rpAppAuthService,
    rpRedditRequestService,
    rpToastService,
    rpLoginService
  ) {
    return function (
      kind,
      resubmit,
      sendreplies,
      sr,
      text,
      title,
      url,
      iden,
      callback
    ) {
      console.log('[rpSubmitService] iden: ' + iden);

      if (rpAppAuthService.isAuthenticated) {
        rpRedditRequestService.redditRequest(
          'post',
          '/api/submit',
          {
            kind: kind,
            sendreplies: sendreplies,
            sr: sr,
            text: text,
            title: title,
            url: url,
            resubmit: resubmit,
            iden: iden
          },
          function (data) {
            // Handle errors here instead of in controller.
            let body = data.json ? data.json : JSON.parse(data.body).json;

            if ((body || {}).errors.length > 0) {
              callback(body, null);
            } else {
              callback(null, body);
            }
          }
        );
      } else {
        rpLoginService.showDialog();
      }
    };
  }

  angular
    .module('rpSubmit')
    .factory('rpSubmitService', [
      'rpAppAuthService',
      'rpRedditRequestService',
      'rpToastService',
      'rpLoginService',
      rpSubmitService
    ]);
}());
