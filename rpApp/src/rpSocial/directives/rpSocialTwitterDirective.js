(function () {
  'use strict';

  function rpSocialTwitter() {
    return {
      restrict: 'E',
      templateUrl: 'rpSocial/views/rpSocialTwitter.html'
    };
  }
  angular.module('rpSocial')
    .directive('rpSocialTwitter', [rpSocialTwitter]);
}());
