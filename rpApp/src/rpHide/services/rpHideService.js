(function () {
  'use strict';

  function rpHideService(rpRedditRequestService) {
    return function (id, isHidden, callback) {
      var uri = isHidden ? '/api/unhide' : '/api/hide';

      rpRedditRequestService.redditRequest('post', uri, {
        id: id
      }, function (data) {
        if (data.responseError) {
          callback(data, null);
        } else {
          callback(null, data);
        }
      });
    };
  }

  angular.module('rpHide')
    .factory('rpHideService', [
      'rpRedditRequestService',
      rpHideService
    ]);
}());
