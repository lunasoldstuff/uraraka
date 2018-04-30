(function () {
  'use strict';

  function rpMediaTrustedResourceFilter($sce) {
    return function (url) {
      return $sce.trustAsResourceUrl(url);
    };
  }

  angular.module('rpMedia')
    .filter('rpMediaTrustedResourceFilter', [
      '$sce',
      rpMediaTrustedResourceFilter
    ]);
}());
