(function () {
  'use strict';

  function rpShareButton() {
    return {
      restrict: 'E',
      templateUrl: 'rpShare/views/rpShareButton.html',
      controller: 'rpShareButtonCtrl',
      scope: {
        post: '='
      }
    };
  }

  angular.module('rpShare')
    .directive('rpShareButton', [rpShareButton]);
}());
