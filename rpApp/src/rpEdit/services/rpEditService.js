(function () {
  'use strict';

  function rpEditService(rpToastService, rpRedditRequestService) {
    return function (text, thingId, callback) {
      console.log('[rpEditService]');

      rpRedditRequestService.redditRequest('post', '/api/editusertext', {
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
      'rpRedditRequestService',
      rpEditService
    ]);
}());
