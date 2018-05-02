(function () {
  'use strict';

  function rpShareEmail() {
    return {
      restrict: 'C',
      templateUrl: 'rpShare/views/rpShareEmail.html',
      controller: 'rpShareEmailCtrl'
    };
  }

  angular.module('rpShare')
    .directive('rpShareEmail', [rpShareEmail]);
}());
