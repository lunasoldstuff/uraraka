(function () {
  'use strict';

  function rpGildButton() {
    return {
      restrict: 'E',
      templateUrl: 'rpGild/views/rpGildButton.html',
      controller: 'rpGildButtonCtrl',
      scope: {
        redditId: '=',
        gilded: '='
      }
    };
  }

  angular.module('rpGild')
    .directive('rpGildButton', rpGildButton);
}());
