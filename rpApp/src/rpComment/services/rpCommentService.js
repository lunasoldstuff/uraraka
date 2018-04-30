(function () {
  'use strict';


  function rpCommentService(rpAppAuthService, rpAppRedditApiService, rpToastService) {
    // to safegaurd against double tapping enter
    // and posting the comment twice
    var replying = false;

    return function (name, comment, callback) {
      console.log('[rpCommentService]');

      if (rpAppAuthService.isAuthenticated) {
        if (comment && !replying) {
          replying = true;

          rpAppRedditApiService.redditRequest('post', '/api/comment', {
            parent: name,
            text: comment
          }, function (data) {
            replying = false;

            if (data.responseError) {
              console.log('[rpCommentService] responseError: ' + JSON.stringify(data));
              let message = 'Something went wrong trying to post you comment :/';

              if (data.body) {
                let body = JSON.parse(data.body);

                console.log('[rpCommentService] responseError, data.body.json: ' + JSON.stringify(body.json));

                if (body.json.errors[0][0] === 'TOO_OLD') {
                  // message = "That post is too old to comment on.";
                  message = body.json.errors[0][1];
                }
              }

              rpToastService(message, 'sentiment_dissatisfied');

              callback(data, null);
            } else {
              rpToastService('comment posted', 'sentiment_satisfied');
              callback(null, data);
            }
          });
        }
      } else {
        rpToastService('you must log in to post comments', 'sentiment_neutral');
      }
    };
  }

  angular.module('rpComment')
    .factory('rpCommentService', [
      'rpAppAuthService',
      'rpAppRedditApiService',
      'rpToastService',
      rpCommentService
    ]);
}());
