(function () {
  'use strict';

  function rpFeedbackResourceService($resource) {
    return $resource('/mail/feedback');
  }

  angular.module('rpFeedback')
    .factory('rpFeedbackResourceService', [
      '$resource',
      rpFeedbackResourceService
    ]);
}());
