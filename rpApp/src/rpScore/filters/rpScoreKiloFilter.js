(function () {
  'use strict';

  function rpScoreKiloFilter() {
    return function (_s) {
      let s = _s;
      if (s > 10000) {
        s /= 1000;
        s = s.toPrecision(3);
        s += 'k';
      }
      return s;
    };
  }

  angular.module('rpScore')
    .filter('rpScoreKiloFilter', [rpScoreKiloFilter]);
}());
