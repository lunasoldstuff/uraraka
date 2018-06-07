(function () {
  'use strict';

  function rpLinkOpenInTabFilter() {
    return function (commentBody) {
      return commentBody.replace(/<a/g, '<a target="_blank"');
    };
  }

  angular.module('rpLink')
    .filter('rpLinkOpenInTabFilter', [rpLinkOpenInTabFilter]);
}());
