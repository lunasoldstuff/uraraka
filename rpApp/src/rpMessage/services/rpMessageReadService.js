(function () {
  'use strict';

  function rpMessageReadService(rpRedditRequestService) {
    return function (message, callback) {
      rpRedditRequestService.redditRequest('post', '/api/read_message', {
        id: message
      }, function (data) {
        if (data.responseError) {
          console.log('[rpMessageReadService] err');
          callback(data, null);
        } else {
          callback(null, data);
        }
      });
    };
  }

  angular.module('rpMessage')
    .factory('rpMessageReadService', [
      'rpRedditRequestService',
      rpMessageReadService
    ]);
}());
