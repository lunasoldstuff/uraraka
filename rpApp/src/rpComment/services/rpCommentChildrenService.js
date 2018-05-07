(function () {
  'use strict';

  function rpCommentChildrenService(rpRedditRequestService) {
    return function (sort, linkId, children, callback) {
      console.log('[rpCommentChildrenService] request more children');

      rpRedditRequestService.redditRequest('get', '/api/morechildren', {
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
      'rpRedditRequestService',
      rpCommentChildrenService
    ]);
}());
