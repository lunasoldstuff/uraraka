(function () {
  'use strict';

  function rpFeedbackResourceService($resource) {
    return $resource('/api/mail/feedback');
  }

  angular.module('rpFeedback')
    .factory('rpFeedbackResourceService', [
      '$resource',
      rpFeedbackResourceService
    ]);
}());
