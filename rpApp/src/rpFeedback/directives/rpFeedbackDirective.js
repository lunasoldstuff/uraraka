(function () {
  'use strict';

  function rpFeedback() {
    return {
      restrict: 'C',
      templateUrl: 'rpFeedback/views/rpFeedback.html',
      controller: 'rpFeedbackCtrl'
    };
  }

  angular.module('rpFeedback')
    .directive('rpFeedback', rpFeedback);
}());
