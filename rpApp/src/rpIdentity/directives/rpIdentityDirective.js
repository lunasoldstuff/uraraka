(function () {
  'use strict';

  function rpIdentity() {
    return {
      restrict: 'E',
      templateUrl: 'rpIdentity/views/rpIdentity.html',
      controller: 'rpIdentityCtrl'
    };
  }

  angular.module('rpIdentity')
    .directive('rpIdentity', [rpIdentity]);
}());
