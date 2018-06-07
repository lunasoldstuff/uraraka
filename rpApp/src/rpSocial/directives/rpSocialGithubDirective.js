(function () {
  'use strict';

  function rpSocialGithub() {
    return {
      restrict: 'E',
      templateUrl: 'rpSocial/views/rpSocialGithub.html'
    };
  }
  angular.module('rpSocial')
    .directive('rpSocialGithub', [rpSocialGithub]);
}());
