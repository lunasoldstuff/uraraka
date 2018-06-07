(function () {
  'use strict';

  function rpMessageCompose() {
    return {
      restrict: 'C',
      templateUrl: 'rpMessage/rpMessageCompose/views/rpMessageCompose.html',
      controller: 'rpMessageComposeCtrl'
    };
  }

  angular.module('rpMessageCompose')
    .directive('rpMessageCompose', [rpMessageCompose]);
}());
