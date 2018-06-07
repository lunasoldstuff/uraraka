(function () {
  'use strict';

  function rpCommentCommentsService(rpRedditRequestService) {
    return function (subreddit, article, sort, comment, context, callback) {
      var params = {
        $subreddit: subreddit,
        $article: article,
        comment: comment,
        context: context,
        showedits: true,
        showmore: true,
        sort: sort
      };

      console.log(`[rpCommentCommentsService] request comments params: ${JSON.stringify(params)}`);

      if (angular.isUndefined(comment) || comment === '') {
        params.depth = 7;
      }
      console.log('[rpCommentCommentsService] depth: ' + params.depth);

      rpRedditRequestService.redditRequest(
        'get',
        '/r/$subreddit/comments/$article',
        params,
        function (data) {
          if (data.responseError) {
            console.log('[rpCommentService] responseError: ' + JSON.stringify(data));
            callback(data, null);
          } else {
            callback(null, data);
          }
        }
      );
    };
  }

  angular
    .module('rpComment')
    .factory('rpCommentCommentsService', [
      'rpRedditRequestService',
      rpCommentCommentsService
    ]);
}());
