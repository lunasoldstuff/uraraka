(function () {
  'use strict';

  function rpMediaRemoveAmpFilter() {
    return function removeAmp(url) {
      const AMP_RE = /amp;/g;
      return url.replace(AMP_RE, '');
    };
  }

  angular.module('rpMedia')
    .filter('rpMediaRemoveAmpFilter', [rpMediaRemoveAmpFilter]);
}());
