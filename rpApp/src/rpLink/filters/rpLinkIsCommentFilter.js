(function () {
  'use strict';

  function rpLinkIsCommentFilter() {
    return function (name) {
      return (name.substr(0, 3) === 't1_');
    };
  }

  angular.module('rpLink')
    .filter('rpLinkIsCommentFilter', [rpLinkIsCommentFilter]);
}());
