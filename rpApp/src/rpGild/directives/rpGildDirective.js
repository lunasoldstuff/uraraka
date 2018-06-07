(function () {
  'use strict';

  function rpGild() {
    return {
      restrict: 'E',
      templateUrl: 'rpGild/views/rpGild.html',
      scope: {
        parentCtrl: '=',
        author: '=',
        gilded: '='
      }
    };
  }

  angular.module('rpGild')
    .directive('rpGild', rpGild);
}());
