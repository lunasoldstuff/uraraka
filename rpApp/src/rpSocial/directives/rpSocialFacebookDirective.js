(function () {
  'use strict';

  function rpSocialFacebook() {
    return {
      restrict: 'E',
      templateUrl: 'rpSocial/views/rpSocialFacebook.html'
    };
  }
  angular.module('rpSocial')
    .directive('rpSocialFacebook', [rpSocialFacebook]);
}());
