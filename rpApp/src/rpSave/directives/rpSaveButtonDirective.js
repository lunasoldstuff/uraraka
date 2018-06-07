(function () {
  'use strict';

  function rpSaveButton() {
    return {
      restrict: 'E',
      templateUrl: 'rpSave/views/rpSaveButton.html',
      controller: 'rpSaveButtonCtrl',
      scope: {
        redditId: '=',
        saved: '='
      }
    };
  }

  angular.module('rpSave')
    .directive('rpSaveButton', [rpSaveButton]);
}());
