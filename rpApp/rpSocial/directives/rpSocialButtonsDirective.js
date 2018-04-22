(function () {
  'use strict';

  function rpSocialButtons() {
    return {
      restrict: 'E',
      templateUrl: 'rpSocial/views/rpSocialButtons.html'
    };
  }
  angular.module('rpSocial').directive('rpSocialButtons', [rpSocialButtons]);
}());
