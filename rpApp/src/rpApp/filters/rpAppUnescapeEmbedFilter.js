(function () {
  'use strict';


  function rpAppUnescapeEmbedFilter($sce) {
    return function (val) {
      var returnVal;
      if (typeof val !== 'undefined' && val !== '') {
        returnVal = (angular.element('<div>' + val + '</div>')
          .text());
        return $sce.trustAsHtml(returnVal);
      }
      return val;
    };
  }
  angular.module('rpApp')
    .filter('rpAppUnescapeEmbedFilter', [
      '$sce',
      rpAppUnescapeEmbedFilter
    ]);
}());
