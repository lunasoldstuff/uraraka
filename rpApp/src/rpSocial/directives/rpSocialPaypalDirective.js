(function () {
  'use strict';

  function rpSocialPaypal() {
    return {
      restrict: 'E',
      templateUrl: 'rpSocial/views/rpSocialPaypal.html'
    };
  }
  angular.module('rpSocial')
    .directive('rpSocialPaypal', [rpSocialPaypal]);
}());
