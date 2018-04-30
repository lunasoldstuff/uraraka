(function () {
  'use strict';

  function rpAppIsMobileViewService($window) {
    const LAYOUT_XS = 600;

    return {
      isMobileView() {
        return $window.innerWidth <= LAYOUT_XS;
      }
    };
  }

  angular.module('rpApp')
    .factory('rpAppIsMobileViewService', [
      '$window',
      rpAppIsMobileViewService
    ]);
}());
