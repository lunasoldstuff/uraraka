(function () {
  'use strict';

  function rpHideService(rpAppRedditApiService) {
    return function (id, isHidden, callback) {
      var uri = isHidden ? '/api/unhide' : '/api/hide';

      rpAppRedditApiService.redditRequest('post', uri, {
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
      'rpAppRedditApiService',
      rpHideService
    ]);
}());
