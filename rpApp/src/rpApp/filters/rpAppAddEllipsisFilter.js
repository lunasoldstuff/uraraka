(function () {
  'use strict';

  function rpAppAddElipsisFilter() {
    return function (s) {
      if (s.length >= 500) return s + '...';
      return s;
    };
  }

  angular.module('rpApp')
    .filter('rpAppAddElipsisFilter', [rpAppAddElipsisFilter]);
}());
