(function () {
  'use strict';

  function rpSaveButtonMenu() {
    return {
      restrict: 'E',
      templateUrl: 'rpSave/views/rpSaveButtonMenu.html',
      controller: 'rpSaveButtonCtrl',
      scope: {
        redditId: '=',
        saved: '='
      }
    };
  }

  angular.module('rpSave')
    .directive('rpSaveButtonMenu', [rpSaveButtonMenu]);
}());
