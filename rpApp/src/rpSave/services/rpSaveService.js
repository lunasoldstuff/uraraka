(function () {
  'use strict';

  function rpSaveService(rpAppRedditApiService) {
    return function (id, save, callback) {
      var uri = save ? '/api/save' : '/api/unsave';

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

  angular.module('rpSave')
    .factory('rpSaveService', [
      'rpAppRedditApiService',
      rpSaveService
    ]);
}());
