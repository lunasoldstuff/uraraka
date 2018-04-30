(function () {
  'use strict';

  function rpAppOpenLinkNewWindowFilter() {
    return function (html) {
      if (html) {
        return html.replace(/&lt;a/g, '&lt;a target="_blank"');
      }
      return html;
    };
  }

  angular.module('rpApp')
    .filter('rpAppOpenLinkNewWindowFilter', [rpAppOpenLinkNewWindowFilter]);
}());
