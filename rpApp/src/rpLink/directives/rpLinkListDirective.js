(function () {
  'use strict';

  function rpLinkList($templateCache) {
    return {
      restrict: 'E',
      templateUrl: 'rpLink/views/rpLinkList.html',
      controller: 'rpLinkCtrl as linkCtrl',
      scope: {
        post: '=',
        parentCtrl: '=',
        identity: '=',
        showSub: '='
      }
    };
  }

  angular.module('rpLink')
    .directive('rpLinkList', ['$templateCache', rpLinkList]);
}());
