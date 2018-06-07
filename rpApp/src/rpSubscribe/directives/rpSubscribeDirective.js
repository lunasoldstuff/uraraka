(function () {
  'use strict';

  function rpSubscribe() {
    return {
      restrict: 'E',
      templateUrl: 'rpSubscribe/views/rpSubscribe.html',
      controller: 'rpSubscribeCtrl'
    };
  }

  angular.module('rpSubscribe')
    .directive('rpSubscribe', [rpSubscribe]);
}());
