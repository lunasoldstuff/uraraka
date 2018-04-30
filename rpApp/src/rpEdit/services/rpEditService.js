(function () {
  'use strict';

  function rpEditService(rpToastService, rpAppRedditApiService) {
    return function (text, thingId, callback) {
      console.log('[rpEditService]');

      rpAppRedditApiService.redditRequest('post', '/api/editusertext', {
        text: text,
        thing_id: thingId
      }, function (data) {
        if (data.responseError) {
          rpToastService('something went wrong trying to edit your post', 'sentiment_dissatisfied');
          callback(data, null);
        } else {
          rpToastService('post editted', 'sentiment_satisfied');
          callback(null, data);
        }
      });
    };
  }

  angular.module('rpEdit')
    .factory('rpEditService', [
      'rpToastService',
      'rpAppRedditApiService',
      rpEditService
    ]);
}());
