(function () {
  'use strict';

  function rpCommentChildrenService(rpAppRedditApiService) {
    return function (sort, linkId, children, callback) {
      console.log('[rpCommentChildrenService] request more children');

      rpAppRedditApiService.redditRequest('get', '/api/morechildren', {
        sort: sort,
        link_id: linkId,
        children: children
      }, function (data) {
        if (data.responseError) {
          callback(data, null);
        } else {
          callback(null, data);
        }
      });
    };
  }

  angular.module('rpComment')
    .factory('rpCommentChildrenService', [
      'rpAppRedditApiService',
      rpCommentChildrenService
    ]);
}());
