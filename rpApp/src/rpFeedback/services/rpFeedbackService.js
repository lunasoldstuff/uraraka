(function () {
  'use strict';

  function rpFeedbackService(rpFeedbackResourceService, rpToastService) {
    return function (title, text, name, callback) {
      rpFeedbackResourceService.save({
        to: 'reddup@reddup.co',
        title: title,
        text: text,
        name: name
      }, function (data) {
        rpToastService('feedback sent', 'sentiment_satisfied');
        callback(null, data);
      }, function (error) {
        rpToastService('something went wrong trying to send your feedback', 'sentiment_dissatisfied');
        callback(error);
      });
    };
  }

  angular.module('rpFeedback')
    .factory('rpFeedbackService', [
      'rpFeedbackResourceService',
      'rpToastService',
      rpFeedbackService
    ]);
}());
