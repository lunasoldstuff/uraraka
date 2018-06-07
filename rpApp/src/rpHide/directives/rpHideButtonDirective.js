(function () {
  'use strict';

  function rpHideButtonMenu() {
    return {
      restrict: 'E',
      templateUrl: 'rpHide/views/rpHideButtonMenu.html',
      controller: 'rpHideButtonCtrl',
      scope: {
        parentCtrl: '=',
        isHidden: '=',
        redditId: '='

      }

    };
  }

  angular.module('rpHide')
    .directive('rpHideButtonMenu', rpHideButtonMenu);
}());
