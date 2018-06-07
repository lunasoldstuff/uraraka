(function () {
  'use strict';

  function rpAppUnescapeHtmlFilter($sce) {
    return function (val) {
      return angular.element('<div>' + $sce.trustAsHtml(val) + '</div>')
        .text();
    };
  }

  angular.module('rpApp')
    .filter('rpAppUnescapeHtmlFilter', [
      '$sce',
      rpAppUnescapeHtmlFilter
    ]);
}());
