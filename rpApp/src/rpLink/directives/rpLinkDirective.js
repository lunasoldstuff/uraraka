(function () {
  'use strict';

  function rpLink($templateCache) {
    return {
      restrict: 'E',
      templateUrl: 'rpLink/views/rpLink.html',
      controller: 'rpLinkCtrl',
      scope: {
        post: '=',
        parentCtrl: '=',
        identity: '=',
        showSub: '='

      }
    };
  }

  angular.module('rpLink')
    .directive('rpLink', ['$templateCache', rpLink]);
}());
