(function () {
  'use strict';

  function rpOpenNewButtonMenu() {
    return {
      restrict: 'E',
      templateUrl: 'rpOpenNew/views/rpOpenNewButtonMenu.html',
      controller: 'rpOpenNewCtrl',
      scope: {
        post: '=',
        isComment: '='

      }

    };
  }

  angular.module('rpOpenNew')
    .directive('rpOpenNewButtonMenu', [rpOpenNewButtonMenu]);
}());
