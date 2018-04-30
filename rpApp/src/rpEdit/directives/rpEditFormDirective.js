(function () {
  'use strict';

  function rpEditForm() {
    return {
      restrict: 'E',
      templateUrl: 'rpEdit/views/rpEditForm.html',
      controller: 'rpEditFormCtrl',
      scope: {
        redditId: '=',
        parentCtrl: '=',
        editText: '='

      }
    };
  }

  angular.module('rpEdit')
    .directive('rpEditForm', rpEditForm);
}());
