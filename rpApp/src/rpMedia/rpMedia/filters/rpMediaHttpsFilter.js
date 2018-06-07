(function () {
  'use strict';

  function rpMediaHttpsFilter() {
    return function (url) {
      const HTTP_RE = /^http:/;
      return HTTP_RE.test(url) ? url.replace(/^http:/, 'https:') : url;
    };
  }

  angular.module('rpMedia')
    .filter('rpMediaHttpsFilter', [rpMediaHttpsFilter]);
}());
