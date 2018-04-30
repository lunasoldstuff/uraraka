(function () {
  'use strict';

  function rpFeedbackSidenav() {
    return {
      restrict: 'E',
      templateUrl: 'rpFeedback/views/rpFeedbackSidenav.html',
      controller: 'rpFeedbackSidenavCtrl'
    };
  }

  angular.module('rpFeedback')
    .directive('rpFeedbackSidenav', [rpFeedbackSidenav]);
}());
