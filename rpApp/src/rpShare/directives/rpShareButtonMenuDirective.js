(function () {
  'use strict';

  function rpShareButtonMenu() {
    return {
      restrict: 'E',
      templateUrl: 'rpShare/views/rpShareButtonMenu.html',
      controller: 'rpShareButtonCtrl',
      scope: {
        post: '='
      }
    };
  }

  angular.module('rpShare')
    .directive('rpShareButtonMenu', [rpShareButtonMenu]);
}());
