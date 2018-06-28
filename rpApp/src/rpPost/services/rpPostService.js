(function () {
  'use strict';

  function rpPostService(
    $rootScope,
    rpPostResourceService,
    rpPostFrontpageResourceService,
    rpToastService,
    rpAppLocationService,
    rpRedditRequestService

  ) {
    return function (sub, sort, after, t, limit, callback) {
      console.log('[rpPostService] limit: ' + limit);

      if (sub) {
        rpRedditRequestService.redditRequest('listing', 'r/$subreddit/$sort', {
          $subreddit: sub,
          t: t,
          limit: limit,
          after: after,
          $sort: sort
        }, function (data) {
          console.log('[rpPostService] data: ' + JSON.stringify(data));

          // Might be indicative of an error. If we have an error getting posts
          // just redirect to the frontpage
          if (data.status === 0) {
            console.log('[rpPostService] unspecified error, redirect to frontpage');
            rpAppLocationService(null, '/', '', true, true);
          } else if (data.responseError) {
            console.log('[rpPostService] responseError data.status: ' + data.status);

            if (data.status === 404) {
              console.log('[rpPostService] responseError');
            }

            /*
              Random.
              Redirect to new sub
              */
            // console.log('[rpPostService] error data: ' + JSON.stringify(data));
            if (data.status === 302) {
              const RANDOM_SUB_RE = /https:\/\/oauth\.reddit\.com\/r\/([\w]+)*/i;
              let groups = RANDOM_SUB_RE.exec(data.body);

              if (groups[1]) {
                console.log('[rpPostService] open random sub: ' + groups[1]);
                rpAppLocationService(null, '/r/' + groups[1], '', true, true);
              }
            } else {
              rpToastService('something went wrong retrieving posts', 'sentiment_dissatisfied');
              rpAppLocationService(null, '/error/' + data.status, '', true, true);
              callback(data, null);
            }
          } else if (sub === 'random') {
            console.log('[rpPostService] random subreddit, redirecting to ' + data.get.data.children[0].data.subreddit);
            rpAppLocationService(null, '/r/' + data.get.data.children[0].data.subreddit, '', true, true);
          } else {
            console.log('[rpPostService] no err returning posts to controller, sub: ' + sub);
            callback(null, data);
          }
        });
      } else {
        rpRedditRequestService.redditRequest('listing', '/$sort', {
          $sort: sort,
          after: after,
          limit: limit,
          t: t
        }, function (data) {
          if (data.responseError) {
            rpToastService('something went wrong retrieving posts', 'sentiment_dissatisfied');
            rpAppLocationService(null, '/error/' + 404, '', true, true);
            // rpAppLocationService(null, '/error/' + data.status, '', true, true);

            callback(data, null);
          } else {
            callback(null, data);
          }
        });
      }
    };
  }

  angular.module('rpPost')
    .factory('rpPostService', [
      '$rootScope',
      'rpPostResourceService',
      'rpPostFrontpageResourceService',
      'rpToastService',
      'rpAppLocationService',
      'rpRedditRequestService',
      rpPostService
    ]);
}());
