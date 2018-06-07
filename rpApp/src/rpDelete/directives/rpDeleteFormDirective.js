(function () {
  'use strict';

  function rpDeleteForm() {
    return {
      restrict: 'E',
      templateUrl: 'rpDelete/views/rpDeleteForm.html',
      controller: 'rpDeleteFormCtrl',
      scope: {
        redditId: '=',
        parentCtrl: '=',
        isComment: '='
      }
    };
  }

  angular.module('rpDelete')
    .directive('rpDeleteForm', rpDeleteForm);
}());
