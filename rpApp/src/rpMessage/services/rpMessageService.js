(function () {
  'use strict';

  function rpMessageService(rpAppRedditApiService, rpToastService) {
    return function (where, after, limit, callback) {
      console.log('[rpMessageService] request messages.');

      rpAppRedditApiService.redditRequest('listing', '/message/$where', {
        $where: where,
        after: after,
        limit: limit
      }, function (data) {
        if (data.responseError) {
          rpToastService('something went wrong retrieving your messages', 'sentiment_dissatisfied');
          callback(data);
        } else {
          callback(null, data);
        }
      });
    };
  }

  angular.module('rpMessage')
    .factory('rpMessageService', [
      'rpAppRedditApiService',
      'rpToastService',
      rpMessageService
    ]);
}());
