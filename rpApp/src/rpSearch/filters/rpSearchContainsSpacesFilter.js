(function () {
  'use strict';

  function rpSearchContainsSpacesFilter() {
    return function (s) {
      const SPACES_RE = /\s/;
      console.log('[rpSearchContainsSpacesFilter] s: ' + s + ', SPACES_RE.test(s): ' + SPACES_RE.test(s));
      return SPACES_RE.test(s);
      // alternative
      // return s.indexOf(' ') !== -1;
    };
  }


  angular.module('rpSearch')
    .filter('rpSearchContainsSpacesFilter', [rpSearchContainsSpacesFilter]);
}());
