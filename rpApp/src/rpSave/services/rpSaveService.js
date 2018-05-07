(function () {
  'use strict';

  function rpSaveService(rpRedditRequestService) {
    return function (id, save, callback) {
      var uri = save ? '/api/save' : '/api/unsave';

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

  angular.module('rpSave')
    .factory('rpSaveService', [
      'rpRedditRequestService',
      rpSaveService
    ]);
}());
