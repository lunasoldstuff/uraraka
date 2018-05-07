(function () {
  'use strict';

  function rpMessageReadAllService($timeout, rpRedditRequestService) {
    return function (callback) {
      var retryAttempts = 9;
      var wait = 2000;

      function attemptReadAllMessages() {
        if (retryAttempts > 0) {
          $timeout(rpRedditRequestService.redditRequest('post', '/api/read_all_messages', {}, function (data) {
            if (data.responseError) {
              retryAttempts -= 1;
              attemptReadAllMessages();
              callback(data, null);
            } else {
              retryAttempts = 3;
              callback(null, data);
            }
          }), (wait * 10) - retryAttempts);
        }
      }
      attemptReadAllMessages();
    };
  }

  angular.module('rpMessage')
    .factory('rpMessageReadAllService', [
      '$timeout',
      'rpRedditRequestService',
      rpMessageReadAllService
    ]);
}());
