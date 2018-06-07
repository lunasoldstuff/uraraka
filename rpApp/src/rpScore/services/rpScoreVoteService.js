(function () {
  'use strict';

  function rpScoreVoteService(rpRedditRequestService) {
    return function (id, dir, callback) {
      rpRedditRequestService.redditRequest('post', '/api/vote', {
        id: id,
        dir: dir
      }, function (data) {
        if (data.responseError) {
          callback(data, null);
        } else {
          callback(null, data);
        }
      });
    };
  }

  angular.module('rpScore')
    .factory('rpScoreVoteService', [
      'rpRedditRequestService',
      rpScoreVoteService
    ]);
}());
